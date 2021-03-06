<?php
/*****************************************************************************************
 * X2CRM Open Source Edition is a customer relationship management program developed by
 * X2Engine, Inc. Copyright (C) 2011-2013 X2Engine Inc.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY X2ENGINE, X2ENGINE DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 * 
 * You can contact X2Engine, Inc. P.O. Box 66752, Scotts Valley,
 * California 95067, USA. or at email address contact@x2engine.com.
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * X2Engine" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by X2Engine".
 *****************************************************************************************/
?>
<div class="page-title"><h2><?php echo Yii::t('admin','Dropdown List'); ?></h2></div>
<div style="width:600px;" class="form"><?php echo Yii::t('admin','Manage all dropdowns.  These can be linked to fields via Field Management.  Any default dropdowns can also be edited here to change the available options throughout the application.  Deleting default dropdowns may cause issues with pre-existing forms.') ?>
</div>
<?php
$this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'fields-grid',
	'baseScriptUrl'=>Yii::app()->request->baseUrl.'/themes/'.Yii::app()->theme->name.'/css/gridview',
	'template'=> '<h2>'.Yii::t('accounts','Dropdowns').'</h2><div class="title-bar">'
		.'{summary}</div>{items}{pager}',
	'dataProvider'=>$dataProvider,
	'columns'=>array(
		'name',
		'options',
		/*
		'tickerSymbol',
		'employees',
		'associatedContacts',
		'notes',
		*/
	),
)); ?>
<br>
<a href="#" onclick="$('#createDropdown').toggle();$('#deleteDropdown').hide();$('#editDropdown').hide();" class="x2-button"><?php echo Yii::t('admin','Create Dropdown'); ?></a>
<a href="#" onclick="$('#deleteDropdown').toggle();$('#createDropdown').hide();$('#editDropdown').hide();" class="x2-button"><?php echo Yii::t('admin','Delete Dropdown'); ?></a>
<a href="#" onclick="$('#editDropdown').toggle();$('#createDropdown').hide();$('#deleteDropdown').hide();" class="x2-button"><?php echo Yii::t('admin','Edit Dropdown'); ?></a>
<br>
<br>
<div id="createDropdown" style="display:none;">
<?php $this->renderPartial('dropDownEditor',array(
    'model'=>$model,
)); ?>
</div>
<div id="deleteDropdown" style="display:none;">
<?php $this->renderPartial('deleteDropdowns',array(
    'dropdowns'=>$dropdowns,
)); ?>
</div>
<div id="editDropdown" style="display:none;">
<?php $this->renderPartial('editDropdown',array(
    'model'=>$model,
)); ?>
</div>