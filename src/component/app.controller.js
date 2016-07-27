import data from './data';
import Papa from 'papaparse';
import _ from 'lodash';
import S from 'string';

const fieldHeaders = [ "handle","parentHandle","title","body","vendor","type","tags","published","option1Name","option1Value","option2Name","option2Value","option3Name","option3Value","variantSKU","variantGrams","variantInventoryTracker","variantInventoryQty","variantInventoryPolicy","variantFulfillmentService","variantPrice","variantCompareAtPrice","variantRequiresShipping","variantTaxable","variantBarcode","imageSrc","ImageAltText","GiftCard","SEOTitle","SEODescription","googleShoppingGoogleProductCategory","googleShoppingGender","googleShoppingAgeGroup","googleShoppingMPN","googleShoppingAdWordsGrouping","googleShoppingAdWordsLabels","googleShoppingCondition","googleShoppingCustomProduct","googleShoppingCustomLabel0","googleShoppingCustomLabel1","googleShoppingCustomLabel2","googleShoppingCustomLabel3","googleShoppingCustomLabel4","variantImage","variantWeightUnit","variantTaxCode"];

const variantProps = ["option1Name","option1Value","option2Name","option2Value","option3Name","option3Value","variantSKU","variantGrams","variantImage","variantInventoryTracker","variantInventoryQty","variantInventoryPolicy","variantFulfillmentService","variantPrice","variantCompareAtPrice","variantRequiresShipping","variantTaxable","variantBarcode","variantWeightUnit"];

const variableProductParentPropertyOverrides = {option1Name:"",option1Value:"",option2Name:"",option2Value:"",option3Name:"",option3Value:"",variantSKU:"",variantGrams:"",variantImage:"",variantInventoryTracker:"",variantInventoryQty:"",variantInventoryPolicy:"",variantFulfillmentService:"",variantPrice:"",variantCompareAtPrice:"",variantRequiresShipping:"",variantTaxable:"",variantBarcode:"",variantWeightUnit:""};

class RawItemCollection {

	constructor() {

		this.items = [];

	}

	addItem(item) {

		const handle = item.handle;

		const foundItem = _.find(this.items, { handle });

		if(foundItem) {

			foundItem.addSubItem(item); 

		} else {

			this.items.push(new RawItem(item));

		}

	}

	getItems() {
		
		return this.items;

	}

}

class RawItem {

	static cleanHtml(html) {
     
		html = S(html).stripTags('div','span','meta').s;

		html = html.replace(new RegExp(' class="([^"]+)"','g'), '');

		html = html.replace(new RegExp(' style="([^"]+)"','g'), '');

		html = html.replace(new RegExp('<iframe(.*?)src="([^"]+)"(.*?)</iframe>','g'), '[embed]$2[/embed]');

		return html
      
    }

    static getTaxable(taxable) {

		return ('true' === taxable) ? 'taxable' : 'none';

	}

	static getPublished(published) {

		return('true' === published) ? 'publish' : 'draft';

	}

	constructor(item) {

		this.handle = item.handle;

		this.subItems = [];

		this.addSubItem(item);

	}

	addSubItem(item) {

		if(item.handle === this.handle) this.subItems.push(item);

	}

	getProcessedRows() {

		if(this.isSimpleProduct()) {

			return [this.getSimpleProduct()];

		} else if(this.isVariableProduct()) {

			return this.getVariableProductItems();

		}

	}

	getSimpleProduct() {

		if(!this.isSimpleProduct()) throw 'error: not a simple product';

		let product = this.getSimpleProductPrimarySubItem();

		let imageSrcs = (product.imageSrc) ? [product.imageSrc] : [];

		_.forEach(this.getAlternateImageSubItems(), (subItem) => {

			imageSrcs.push(subItem.imageSrc);

		});

		product.body = RawItem.cleanHtml(product.body);
		product.imageSrc = imageSrcs.join('|');
		product.variantTaxable = RawItem.getTaxable(product.variantTaxable);
		product.published = RawItem.getPublished(product.published);
		product.option1Name = "";
		product.option1Value = "";
		product.option2Name = "";
		product.option2Value = "";
		product.option3Name = "";
		product.option3Value = "";		

		return product;

	}

	getVariableProductItems() {

		let parentSubItem = this.getVariableProductParentSubItem();

		let processedParentSubItem = _.assignIn(_.clone(parentSubItem), variableProductParentPropertyOverrides);

		let imageSrcs = (processedParentSubItem.imageSrc) ? [processedParentSubItem.imageSrc] : [];

		let nonParentSubItems = this.getVariableProductNonParentSubItems();

		_.forEach(nonParentSubItems, (nonParentSubItem) => {

			if(!_.isEmpty(nonParentSubItem.imageSrc)) imageSrcs.push(nonParentSubItem.imageSrc);

		});

		processedParentSubItem.published = RawItem.getPublished(parentSubItem.published);

		processedParentSubItem.imageSrc = imageSrcs.join('|');

		nonParentSubItems.push(_.pick(_.clone(parentSubItem),variantProps));

		let processedNonParentSubItems = [];

		_.forEach(nonParentSubItems, (nonParentSubItem) => {

			processedNonParentSubItems.push(
				_.assignIn(_.clone(nonParentSubItem), {title: parentSubItem.title, variantTaxable: RawItem.getTaxable(parentSubItem.variantTaxable), published: RawItem.getPublished(parentSubItem.published), handle:"", parentHandle:parentSubItem.handle, option1Name:parentSubItem.option1Name, option2Name:parentSubItem.option2Name,option3Name:parentSubItem.option3Name, imageSrc: ""})
			);

		});

		processedParentSubItem.body = RawItem.cleanHtml(processedParentSubItem.body);

		let result = [processedParentSubItem];

		return result.concat(processedNonParentSubItems);

	}

	isSimpleProduct() {
		
		if(this.subItems.length === 1) {
			
			return true;

		} else if (this.numAlternateImageSubItems() === (this.subItems.length - 1)) {

			return true;

		}

		return false;

	}

	isVariableProduct() {

		if(this.subItems.length > 1 && this.numAlternateImageSubItems() < (this.subItems.length - 1)) {

			return true;

		}

		return false;

	}

	getAlternateImageSubItems() {

		let subItems = [];

		_.forEach(this.subItems, (subItem) => {

			if(this.isAlternateImageSubItem(subItem)) subItems.push(subItem);

		});

		return subItems;

	}

	getSimpleProductPrimarySubItem() {

		let primarySubItem = false;

		_.forEach(this.subItems, (subItem) => {

			if(_.difference(['handle','title'], _.keys(_.pickBy(subItem, _.negate(_.isEmpty)))).length === 0) primarySubItem = subItem;

		});

		if(false === primarySubItem) throw 'error: primary sub item not found';

		return primarySubItem;

	}

	getVariableProductParentSubItem() {

		let parentSubItem = false;

		_.forEach(this.subItems, (subItem) => {

			if(_.difference(['handle','title'], _.keys(_.pickBy(subItem, _.negate(_.isEmpty)))).length === 0) parentSubItem = subItem;

		});

		if(false === parentSubItem) throw 'error: parent sub item not found';

		return parentSubItem;		

	}

	getVariableProductNonParentSubItems() {

		let nonParentSubItems = [];

		let parentSubItem = this.getVariableProductParentSubItem();

		_.forEach(this.subItems, (subItem) => {

			if(!_.isEqual(subItem, parentSubItem)) nonParentSubItems.push(subItem);

		});

		if(nonParentSubItems.length === 0) throw 'error: no non parent sub items found';

		return nonParentSubItems;		

	}

	numAlternateImageSubItems() {

		return this.getAlternateImageSubItems().length;

	}

	isAlternateImageSubItem(subItem) {

		return _.isEqual(_.keys(_.pickBy(subItem, _.negate(_.isEmpty))), ['handle','imageSrc']);

	}

}

class controller {

	constructor(scroll, foundation) {

		this.fieldHeaders = fieldHeaders;

		let rawData = Papa.parse(data, {header:true}).data;

		let outputItems = [];

		let rawItemCollection = new RawItemCollection();

		_.forEach(rawData, (rawDataItem) => {

			rawItemCollection.addItem(rawDataItem);

		});

		_.forEach(rawItemCollection.getItems(), (rawItem) => {

			outputItems = outputItems.concat(rawItem.getProcessedRows());

		});

		this.items = outputItems;

		// console.log(_.find(outputItems, {handle: 'forget-me-not-get-well-soon-cards'})); // variable parent

		// console.log(_.filter(outputItems, {parentHandle: 'forget-me-not-get-well-soon-cards'})); // variable parent

	}

}

export { controller, controller as default }