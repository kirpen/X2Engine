<?php

Yii::import('application.models.*');
Yii::import('application.modules.quotes.models.*');

/**
 * Test of Quote line item methods
 *
 * @package X2CRM.tests.unit.modules.quotes.models
 */
class QuoteProductTest extends CTestCase {

	public function testIsTotalAdjustment() {
		foreach(array('totalPercent','totalLinear') as $adjType) {
			$qp = new QuoteProduct();
			$qp->adjustmentType = $adjType;
			$this->assertTrue($qp->isTotalAdjustment);
		}
		foreach(array('percent','linear') as $adjType) {
			$qp = new QuoteProduct();
			$qp->adjustmentType = $adjType;
			$this->assertFalse($qp->isTotalAdjustment);
		}
	}

	public function testIsPercentAdjustment() {
		foreach(array('totalPercent','percent') as $adjType) {
			$qp = new QuoteProduct();
			$qp->adjustmentType = $adjType;
			$this->assertTrue($qp->isPercentAdjustment);
		}
		foreach(array('totalLinear','linear') as $adjType) {
			$qp = new QuoteProduct();
			$qp->adjustmentType = $adjType;
			$this->assertFalse($qp->isPercentAdjustment);
		}
	}

	public function testFormatAttribute() {
		$qp = new QuoteProduct();
		$qp->adjustmentType = 'percent';
		$qp->adjustment = 5;
		$this->assertEquals('5%',$qp->formatAttribute('adjustment'));
	}
}

?>
