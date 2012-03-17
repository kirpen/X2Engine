<?php
/*********************************************************************************
 * The X2CRM by X2Engine Inc. is free software. It is released under the terms of 
 * the following BSD License.
 * http://www.opensource.org/licenses/BSD-3-Clause
 * 
 * X2Engine Inc.
 * P.O. Box 66752
 * Scotts Valley, California 95066 USA
 * 
 * Company website: http://www.x2engine.com 
 * Community and support website: http://www.x2community.com 
 * 
 * Copyright � 2011-2012 by X2Engine Inc. www.X2Engine.com
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * - Redistributions of source code must retain the above copyright notice, this 
 *   list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this 
 *   list of conditions and the following disclaimer in the documentation and/or 
 *   other materials provided with the distribution.
 * - Neither the name of X2Engine or X2CRM nor the names of its contributors may be 
 *   used to endorse or promote products derived from this software without 
 *   specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 ********************************************************************************/

$this->menu=array(
	array('label'=>Yii::t('calendar','Calendar'), 'url'=>array('index')),
	array('label'=>Yii::t('calendar', 'My Calendar Permissions')),
	array('label'=>Yii::t('calendar','List'), 'url'=>array('list')),
	array('label'=>Yii::t('calendar','Create'), 'url'=>array('create')),
);
?>

<div class="x2-layout form-view" style="margin-bottom: 0;">
	<div class="formSection">
		<div class="formSectionHeader">
			<span class="sectionTitle"><?php echo Yii::t('calendar', 'My Calendar Permissions'); ?></span>
		</div>
	</div>
</div>

<?php
$form=$this->beginWidget('CActiveForm', array(
   'id'=>'permissions-form',
   'enableAjaxValidation'=>false,
));
?>

<div class="form" style="border:1px solid #ccc; border-top: 0; padding: 0; margin-top:-1px; border-radius:0;-webkit-border-radius:0; background:#eee;">
	<table frame="border">
		<td>
			<label for="viewPermission"><?php echo Yii::t('calendar', 'View Permission'); ?></label>
			<?php echo $form->dropDownList($model, 'calendarViewPermission', $users, array(
				'tabindex'=>1,
			    'title'=>Yii::t('calendar', 'View Permission'),
			    'id'=>'viewPermission',
			    'multiple'=>'multiple',
			)); ?>
		</td>
		<td>
			<label for="editPermission"><?php echo Yii::t('calendar', 'Edit Permission'); ?></label>
			<?php echo $form->dropDownList($model, 'calendarEditPermission', $users, array(
				'tabindex'=>2,
			    'title'=>Yii::t('calendar', 'Edit Permission'),
			    'id'=>'editPermission',
			    'multiple'=>'multiple',
			)); ?>
		</td>
	</table>
</div>

<?php
echo '	<div class="row buttons">'."\n";
echo '		'.CHtml::submitButton(Yii::t('app','Save'),array('class'=>'x2-button','id'=>'save-button', 'name'=>'save-button', 'tabindex'=>24))."\n";
echo "	</div>\n";

$this->endWidget();
?>
