import module from '../module';
import controller from './app.controller';

controller.$inject = ['$anchorScroll', 'FoundationApi'];

const component = 'app';

const selector = 'app';

const template = `
  <table>
    <thead>
      <tr>
        <th ng-repeat="field in $ctrl.fieldHeaders" ng-bind="field"></th>
      </tr>
    </thead>
    <tbody>
      <tr ng-if="$ctrl.items" ng-repeat="item in $ctrl.items"> 
        <td ng-bind="item.handle"></td>
        <td ng-bind="item.parentHandle"></td>
		<td ng-bind="item.title"></td>
		<td ng-bind="item.body"></td>
		<td ng-bind="item.vendor"></td>
		<td ng-bind="item.type"></td>
		<td ng-bind="item.tags"></td>
		<td ng-bind="item.published"></td>
		<td ng-bind="item.option1Name"></td>
		<td ng-bind="item.option1Value"></td>
		<td ng-bind="item.option2Name"></td>
		<td ng-bind="item.option2Value"></td>
		<td ng-bind="item.option3Name"></td>
		<td ng-bind="item.option3Value"></td>
		<td ng-bind="item.variantSKU"></td>
		<td ng-bind="item.variantGrams"></td>
		<td ng-bind="item.variantInventoryTracker"></td>
		<td ng-bind="item.variantInventoryQty"></td>
		<td ng-bind="item.variantInventoryPolicy"></td>
		<td ng-bind="item.variantFulfillmentService"></td>
		<td ng-bind="item.variantPrice"></td>
		<td ng-bind="item.variantCompareAtPrice"></td>
		<td ng-bind="item.variantRequiresShipping"></td>
		<td ng-bind="item.variantTaxable"></td>
		<td ng-bind="item.variantBarcode"></td>
		<td ng-bind="item.imageSrc"></td>
		<td ng-bind="item.imageAltText"></td>
		<td ng-bind="item.giftCard"></td>
		<td ng-bind="item.seoTitle"></td>
		<td ng-bind="item.seoDescription"></td>
		<td ng-bind="item.googleShoppingGoogleProductCategory"></td>
		<td ng-bind="item.googleShoppingGender"></td>
		<td ng-bind="item.googleShoppingAgeGroup"></td>
		<td ng-bind="item.googleShoppingMPN"></td>
		<td ng-bind="item.googleShoppingAdWordsGrouping"></td>
		<td ng-bind="item.googleShoppingAdWordsLabels"></td>
		<td ng-bind="item.googleShoppingCondition"></td>
		<td ng-bind="item.googleShoppingCustomProduct"></td>
		<td ng-bind="item.googleShoppingCustomLabel0"></td>
		<td ng-bind="item.googleShoppingCustomLabel1"></td>
		<td ng-bind="item.googleShoppingCustomLabel2"></td>
		<td ng-bind="item.googleShoppingCustomLabel3"></td>
		<td ng-bind="item.googleShoppingCustomLabel4"></td>
		<td ng-bind="item.variantImage"></td>
		<td ng-bind="item.variantWeightUnit"></td>
		<td ng-bind="item.variantTaxCode"></td>
      </tr>
    </tbody>
  </table>
`;

module.component(
	component,
	{
		controller,
		template
	}
)

export { component, component as default }