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
 * Copyright © 2011-2012 by X2Engine Inc. www.X2Engine.com
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
?><h2><?php echo Yii::t('admin','Manage Lead Routing'); ?></h2>
<?php echo Yii::t('admin','Manage routing criteria. This setting is only required if lead distribution is set to "Custom Round Robin"'); ?>

<?php

$this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'routing-grid',
	'baseScriptUrl'=>Yii::app()->request->baseUrl.'/themes/'.Yii::app()->theme->name.'/css/gridview',
	'dataProvider'=>$dataProvider,
	'columns'=>array(
		array(

			'name'=>'value',
			'header'=>Yii::t('admin','Criteria'),
			'value'=>'$data->field."=".$data->value',
			'type'=>'raw',
			'htmlOptions'=>array('width'=>'80%'),
		),
                array(

			'name'=>'users',
			'header'=>Yii::t('admin','Users'),
			'value'=>'UserChild::getUserLinks($data->users)',
			'type'=>'raw',
			'htmlOptions'=>array('width'=>'80%'),
		),
                array(

			'name'=>'delete',
			'header'=>Yii::t('admin','Delete'),
			'value'=>'CHtml::link("Delete","deleteRouting/$data->id")',
			'type'=>'raw',
			'htmlOptions'=>array('width'=>'80%'),
		),
		
	),
));
?>
<br>

<h2><?php echo Yii::t('admin','Add Criteria for Lead Routing'); ?></h2>
<?php echo Yii::t('admin','To add a condition which will affect how leads are distributed, please fill out the form below.'); ?><br><br>


<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'routing-form',
	'enableAjaxValidation'=>false,
)); ?>

	<em><?php echo Yii::t('app','Fields with <span class="required">*</span> are required.'); ?></em><br>
        
        <div class="row">
            <?php echo $form->labelEx($model,'field'); ?>
            <?php
			// die(var_dump(X2Model::model('Contacts')));
			// $contact = new Contacts;
			// echo $form->dropDownList($model,'field',$contact->attributeLabels());
			echo $form->dropDownList($model,'field',CActiveRecord::model('Contacts')->attributeLabels()); ?>
            <?php echo $form->error($model,'field'); ?>
        </div>
        
        <div class="row">
            <?php echo $form->labelEx($model,'value'); ?>
            <?php echo $form->textField($model,'value'); ?>
            <?php echo $form->error($model,'value'); ?>
        </div>
        
        <div class="row">
            <?php echo $form->labelEx($model,'users'); ?>
            <?php echo $form->dropDownList($model,'users',$users,array('multiple'=>'multiple','size'=>7,'id'=>'assignedToDropdown')); ?>
            <?php echo $form->error($model,'users'); ?>
            <?php /* x2temp */
                            echo "<br>";
                            $url=$this->createUrl('groups/getGroups');
                            echo "<label>Group?</label>";
                            echo CHtml::checkBox('group','',array(
                                'id'=>'groupCheckbox',
                                'ajax'=>array(
                                    'type'=>'POST', //request type
                                        'url'=>$url, //url to call.
                                        //Style: CController::createUrl('currentController/methodToCall')
                                        'update'=>'#assignedToDropdown', //selector to update
                                        'complete'=>'function(){
                                            if($("#groupCheckbox").attr("checked")!="checked"){
                                                $("#groupCheckbox").attr("checked","checked");
                                                $("#groupType").show();
                                            }else{
                                                $("#groupCheckbox").removeAttr("checked");
                                                $("#assignedToDropdown option[value=\'\']").remove();
                                                $("#assignedToDropdown option[value=\'admin\']").remove();
                                                $("#groupType").hide();
                                            }
                                        }'
                                )
                            ));
                            echo "<br>";
                            echo CHtml::dropDownList('groupType', '', array('0'=>'Within Group(s)','1'=>'Between Group(s)'),array('id'=>'groupType','style'=>'display:none'))
                        /* end x2temp */ ?>
        </div>
        
	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? Yii::t('app','Create'):Yii::t('app','Save'),array('class'=>'x2-button')); ?>
	</div>
<?php $this->endWidget(); ?>
</div>
