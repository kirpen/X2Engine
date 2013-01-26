/*********************************************************************************
 * The X2CRM by X2Engine Inc. is free software. It is released under the terms of 
 * the following BSD License.
 * http://www.opensource.org/licenses/BSD-3-Clause
 * 
 * X2Engine Inc.
 * P.O. Box 66752
 * Scotts Valley, California 95067 USA
 * 
 * Company website: http://www.x2engine.com 
 * Community and support website: http://www.x2community.com 
 * 
 * Copyright (C) 2011-2012 by X2Engine Inc. www.X2Engine.com
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

var formEditorVersion = '1.2';

window.selectedFormItems = $([]);
window.layoutChanged = false;


function toggleFormSection(section) {
	if($(section).hasClass('showSection'))
		$(section).find('.tableWrapper').slideToggle(400,function(){
			$(this).parent('.formSection').toggleClass('showSection');
		});
	else
		$(section).toggleClass('showSection').find('.tableWrapper').slideToggle(400);
}

$(function() {

	///////////////// Form Section Controls /////////////////
	
	// setup form editor controls
	$('#addRow').click(function() {
		addFormSection();
	});
	$('#addCollapsibleRow').click(function() {
		addFormSection('collapsible');
	});
	
	$('#setTabOrder').click(function() {
		$(this).toggleClass('clicked');
		$('#formEditor').toggleClass('tabOrderMode');
		$('#formEditor .formTabOrder').each(function(i,item) {
			$(item).html((i+1));
		
		});
	});
	
	// form subsection delete
	$(document).delegate('.formSectionDelete','click',function() {
		deleteFormSection($(this))
	});
	
	// enter preview mode
	$('#borderToggleButton').click(function() {
		deselectAll();
		
		$('#formEditor').toggleClass('editMode');
		$('#borderToggleButton').toggleClass('clicked');
		if($('#borderToggleButton').hasClass('clicked'))
			$('.formSortable').sortable('option','disabled',true);
		else
			$('.formSortable').sortable('option','disabled',false);
	});
	
	$('#formEditorForm').submit(function() {
		
			// console.debug(generateFormJson());
		if($('#modelList').val() != '' && $('#modelList').val() != '')
			$('#layoutHiddenField').val(generateFormJson());
		else
			return false;
	});

	// form subsection toggle
	$('div.x2-layout').delegate('.formSectionShow, .formSectionHide','click',function() {
		toggleFormSection($(this).closest('.formSection'));
		saveFormSections();
	});

	// form section add column
	$(document).delegate('.formSectionAddCol','click',function() {
		addColumn($(this).closest('.formSection'));
	});
	// form section delete column
	$(document).delegate('.formSectionDelCol','click',function() {
		deleteColumn($(this).closest('.formSection'));
	});
	// form section delete column
	$(document).delegate('.formSectionSetName','click',function() {
		setSectionName($(this).closest('.formSection'));
	});

	
	
	///////////////// Form Item Selection/Deselection /////////////////
	
	
	// formItem selection
	$(document).delegate('#formEditor .formItem','click',function(e) {
		if(!$('#borderToggleButton').hasClass('clicked')) {
			if(!e.shiftKey) {
				deselectAll();
			}
			if(window.selectedFormItems.is(this)) {	// if the item is already selected
				$(this).removeClass('selected');
				window.selectedFormItems = window.selectedFormItems.not(this);
				if(window.selectedFormItems.length == 0)
					$('.formItemOptions').fadeOut(400);
			} else {
				$(this).addClass('selected');
				window.selectedFormItems = window.selectedFormItems.add(this);
				updateFormItemOptions();
				
				$('.formItemOptions').fadeIn(400);
			}
		}
	});
	// deselect formItems when user clicks on white space
	$(document).click(function(e) {
		var elements = $(e.target).add($(e.target).parents());
		
		if(!e.shiftKey && !elements.is('#formEditor .formItem, #formEditorControls')) {
			deselectAll();
		}
	});
	
	///////////////// Form Item Manipulation /////////////////
	
	// listen for delete keys ... if a formItem is selected, delete that junk
	$(document).keydown(function(e) {
		if(e.which==46 && $('input:focus, textarea:focus').length == 0) {	// if we're in a text box, nevermind
			window.selectedFormItems.removeClass('selected').appendTo('#editorFieldList');
			resetFormItem(window.selectedFormItems);
			sortFieldList();
			deselectAll();
		}
	});
	
	
	// listen for changes in labelType option
	$('#labelType').change(function(e) {
		setLabelType(window.selectedFormItems,$(this).val());
	});
	
	// listen for changes in readOnly option
	$('#readOnly').change(function(e) {
		setReadOnly(window.selectedFormItems,$(this).val());
	});
	
	
	
	///////////////// jQuery Sortables Setup /////////////////
	
	// main form sortable has rows that don't connect to any other sortables
	$('#formEditor').sortable({
		tolerance:'intersect',
		items:'.formSection',
		placeholder:'formSectionPlaceholder',
		handle:'.formSectionHeader',
		opacity:0.5,
		axis:'y',
		distance:10,
		change:function() { window.layoutChanged = true; }
	});
	// $('#formEditor .formItem').disableSelection();
	
	
	// list of available fields on the side
	$('#editorFieldList').sortable({
		connectWith: '.formSortable',
		tolerance: 'pointer',
		placeholder:'formItemPlaceholder',
		remove: function(event, ui) {		// make items resizable when removed from main list
				$(event.target).closest('.formItem').data({'labelType':'top','readOnly':0}).find('.formInputBox').resizable({
					grid: [5,10],
					handles: ($(event.target).parent().find('textarea').length > 0)? 'e,se,s':'e',
					stop:function() { window.layoutChanged = true; }
				}).closest('.formInput').addClass('topLabel');
				window.layoutChanged = true;
			},
		receive: function(event, ui) {
				resetFormItem($(ui.item));	// clear formItem's settings
				sortFieldList();			// sort field list
				window.layoutChanged = true;
			},
		update: function(event,ui) { sortFieldList(); }
	});

	// setup field text toggling for any formItem that might get changed to inlineLabel
	$('div.x2-layout').delegate('div.x2-layout .inlineLabel input:text, div.x2-layout .inlineLabel textarea','focus',function() { formFieldFocus(this); });
	$('div.x2-layout').delegate('div.x2-layout .inlineLabel input:text, div.x2-layout .inlineLabel textarea','blur',function() { formFieldBlur(this); });
	
	
});

// creates a new formSelection in the formEditor sortable
function addFormSection(type,columns,title) {

	if(typeof type == 'undefined')
		type = 'default';

	if(typeof columns != 'number')
		columns = 1;

	if(typeof title == 'undefined')
		title = '';
	
	// create formSection div and formSectionHeader, with editing links
	var html = '<div class="formSectionHeader">';
	html += '<a href="javascript:void(0)" class="formSectionDelCol">&ndash;Col</a>';
	html += '<a href="javascript:void(0)" class="formSectionAddCol">+Col</a>';
	html += '<a href="javascript:void(0)" class="formSectionSetName">Rename</a>';
	html += '<a href="javascript:void(0)" class="formSectionDelete">[ x ]</a>';
	// add toggle link if this is collapsible
	if(type == 'collapsible')
		html += '<a href="javascript:void(0)" class="formSectionShow">[+]</a><a href="javascript:void(0)" class="formSectionHide">[&ndash;]</a>';
	html += '<span class="sectionTitle">'+title+'</span>';
	html += '</div><div class="tableWrapper"><table><tr class="formSectionRow">';
	// add however many columns
	for(a=0; a<columns; a++) {
		html += '<td><div class=\"formSortable\"></div></td>';
	}
	html += '</tr></table></div></div>';
	// $('#formEditor').find('.formSortable').css('border','1px solid red');

	$(document.createElement('div'))
		.addClass('formSection showSection'+((type == 'collapsible')? ' collapsible':''))
		.appendTo('#formEditor').html(html)
		.find('.formSortable')
		.sortable({
			connectWith:'.formSortable',
			items:'.formItem',
			tolerance:'pointer',
			placeholder:'formItemPlaceholder'
		});
	
	var $formContent = $('#formEditor').find('.formSection').last().find('table');
	setupColResizing($formContent);
	
	window.layoutChanged = true;
}

// deletes a form section, finding all formItems and returning them to the field list
function deleteFormSection($formSection) {
	var formItems = $formSection.closest('.formSection').find('.formItem');
	resetFormItem(formItems);
	window.selectedFormItems = window.selectedFormItems.not(formItems);
	formItems.removeClass('selected').appendTo('#editorFieldList');
	sortFieldList();
	$formSection.closest('.formSection').fadeOut(300,function() { $(this).remove(); });
	
	window.layoutChanged = true;
}

function setSectionName($formSection) {
	var newName = prompt('Please enter a name for this section.');
	if(newName != null)
		$formSection.find('.sectionTitle').html(newName);
}


// adds a new column to the current form section
function addColumn($formSection) {
	var $formContent = $formSection.find('table');
	
	// loop through every row of the table, transferring formItems left
	$formContent.find('tr.formSectionRow').each(function(i,row) {
	
		var columns = $(row).find('td');
	
		$('<td><div class=\"formSortable\"></div></td>').appendTo($(row)).find('.formSortable').sortable({
				connectWith:'.formSortable',
				tolerance:'pointer',
				items:'.formItem',
				placeholder:'formItemPlaceholder'
			});
	
		if(i==0) { // first row only: calculate new widths
		
			// calculate old average column width, then calculate average with the new column
			var targetWidth = $(row).width();
			
			var averageWidth = targetWidth / columns.length;
			$(row).find('td:last').width(averageWidth);

			var widthFactor = targetWidth / $(row).width();

			// scale column to have the same total width
			var sum = 0, scaledSum = 0, newWidth = 0;
			$(row).find('td').each(function(i,cell) {
				sum += $(cell).width();
				newWidth = Math.round((sum*widthFactor)-scaledSum);
				$(cell).width(newWidth-1);
				scaledSum += newWidth;
			});
		}
	});

	setupColResizing($formContent);
	
	window.layoutChanged = true;
}

// deletes the last column, moving its contents to the previous column's formSortable div
function deleteColumn($formSection) {
	var $formContent = $formSection.find('table');
	// loop through every row of the table, transferring formItems left
	$formContent.find('tr.formSectionRow').each(function(i,row) {
	
		
		var columns = $(row).find('td');
		if(columns.length < 2)
			return;

		if(i==0) { // first row only: calculate new widths
			
			// calculate old average column width, then calculate average with the new column
			var targetWidth = $(row).width();
			var widthFactor = targetWidth / (targetWidth - columns.last().width());
			// scale column to have the same total width
			var sum = 0, scaledSum = 0, newWidth = 0;
			$(row).find('td:not(:last)').each(function(i,cell) {
				sum += $(cell).width();
				newWidth = Math.round((sum*widthFactor)-scaledSum);
				$(cell).width(newWidth)+1;
				scaledSum += newWidth;
			});
		}

		var lastCell = $(columns[columns.length-1]);
		var secondToLast = $(columns[columns.length-2]);

		lastCell.find('.formItem').appendTo(secondToLast.find('.formSortable')); // transfer form items to the left
		lastCell.remove();
	});
	setupColResizing($formContent);
	
	window.layoutChanged = true;
}

// removes and recreates resize handles for the formSection table columns
function setupColResizing($table) {
	$table.colResizable({disable:true})	// remove old colResizable class, if it exists
		.colResizable({
			liveDrag:true,
			draggingClass:'colResizableDragging',
			onResize:function() { window.layoutChanged = true; }
		});
}

// formats all selected formItems to the chosen label type
function setLabelType(formItems,type) {

	if(typeof type != 'undefined' && type != '')
		formItems.data('labelType',type);	// store type via jQuery's Data system
		
	switch(type) {
		case 'left':
			formItems.each(function(i,item) {
				$(item).removeClass('inlineLabel noLabel topLabel').addClass('leftLabel');
				$(item).find('input,textarea').attr('value','').val('').css('color','#000');	// reset default value and clear field
			});
			break;
		case'inline':
			formItems.each(function(i,item) {
				$(item).removeClass('topLabel leftLabel').addClass('inlineLabel');
				var attributeLabel = $(item).find('label').html();
				$(item).find('input,textarea').attr('value',attributeLabel).val(attributeLabel).css('color','#aaa');	// reset default value and clear field
			});
			break;
		case 'none':
			formItems.each(function(i,item) {
				$(item).removeClass('inlineLabel topLabel leftLabel').addClass('noLabel');
				$(item).find('input,textarea').attr('value','').val('').css('color','#000');	// reset default value and clear field
			});
			break;
		case 'top':
		default:
			formItems.each(function(i,item) {
				$(item).removeClass('inlineLabel noLabel leftLabel').addClass('topLabel');
				$(item).find('input,textarea').attr('value','').val('').css('color','#000');	// reset default value and clear field
			});
	}
	
	window.layoutChanged = true;
}

// sets all selected formItems to be read-only (disabled)
function setReadOnly(formItems,readOnly) {
	if(typeof readOnly != 'undefined' && readOnly != '')
		formItems.data('readOnly',readOnly);	// store readOnly via jQuery's Data system
		
	switch(readOnly) {
		case '1':
			formItems.find('input,textarea').attr('disabled','disabled');
			break;
		case '0':
		default:
			formItems.find('input,textarea').removeAttr('disabled');
	}
	
	window.layoutChanged = true;
}

// scans all selected elements to see if they share any values, and updates the formItemOptions controls
function updateFormItemOptions() {

	var labelType = '';
	var readOnly = '';
	window.selectedFormItems.each(function(i,item) {
		if(labelType == '')
			labelType = $(item).data('labelType');
		else if(labelType != $(item).data('labelType'))
			labelType = 'mixed';
			
		if(readOnly == '')
			readOnly = $(item).data('readOnly');
		else if(readOnly != $(item).data('readOnly'))
			readOnly = 'mixed';
			
	});
	$('#labelType').val(labelType);
	$('#readOnly').val(readOnly);
}

function deselectAll() {
	window.selectedFormItems.removeClass('selected');	// deselect all elements
	window.selectedFormItems = $([]);
	$('.formItemOptions').fadeOut(400);
}


// removes all user settings from an array of formItems (label setup, size, read-only, etc)
function resetFormItem($items) {
	window.selectedFormItems = window.selectedFormItems.not($items);
	$items.removeClass('selected');	// disable resizing, and de-select this item
	$items.removeClass('noLabel leftLabel').addClass('topLabel');
	$items.find('.formInputBox').resizable('destroy').css({'height':'','width':''});
	$items.find('input, textarea').attr('value','').removeAttr('disabled').val('').css('color','#000');
	$items.data('labelType','');
	$items.data('readOnly','');
}

// puts field list in alphabetical order
function sortFieldList() {
	var mylist = $('#editorFieldList');
	var listitems = mylist.children('.formItem').get();
	listitems.sort(function(a, b) {
		var labelA = $(a).find('label').html().toLowerCase();
		var labelB = $(b).find('label').html().toLowerCase();
		return labelA.localeCompare(labelB);
	});
	$.each(listitems, function(idx, itm) {
		mylist.append(itm);
	});
}


// loop through form structure and generate a JSON layout string
function generateFormJson() {

	var formSections = [];
	
	// loop through sections, add rows to rows[]
	$('#formEditor .formSection').each(function(i,section) {
		var sectionJson = '{';
		var rows = [];
		if($(section).hasClass('collapsible'))
			sectionJson += '"collapsible":true,'
		else
			sectionJson += '"collapsible":false,'
		var title = $(section).find('.sectionTitle').html();
		
		sectionJson += '"title":"'+((title=='undefined')? '' : title.replace(/\\/g,'\\\\').replace(/"/g, '\\\"'))+'",';
		
		// loop through rows, add columns to cols[]
		$(section).find('tr').each(function(j,row) {
			var rowJson = '{';
			var cols = [];
			
			// loop through columns, add formItems to [items], also add widths
			$(row).find('td').each(function(k,col) {
				columnJson = '{"width":'+$(col).width()+',';
				var items = [];
				
				// loop through formItems and get all individual properties (height, width, options)
				$(col).find('.formItem').each(function(l,item) {
					var itemJson = '{';
					itemJson += '"name":"' + $(item).attr('id') + '",';
					itemJson += '"labelType":"' + $(item).data('labelType') + '",';
					itemJson += '"readOnly":"' + $(item).data('readOnly') + '",';
					itemJson += '"height":"' + $(item).find('.formInputBox').height() + '",';
					itemJson += '"width":"' + $(item).find('.formInputBox').width() + '",';
					itemJson += '"tabindex":"' + $(item).find('input,textarea,checkbox,select').first().attr('tabindex')+'"';
					
					itemJson += '}';
					items.push(itemJson);
				});
				
				columnJson += '"items":['+items.join(',')+']}';
				cols.push(columnJson);
			});
			
			rowJson = '{"cols":['+cols.join(',')+']}';
			rows.push(rowJson);
		});

		sectionJson += '"rows":['+rows.join(',')+']}';
		formSections.push(sectionJson);
	});
	return '{"version":"'+formEditorVersion+'","sections":[' + formSections.join(',') + ']}';
}

// parse a JSON layout string and call appropriate functions to recreate the layout
function loadFormJson(formJson) {

	var form = $.parseJSON(formJson);
	// console.log(form);

	for(i=0; i<form.sections.length; i++) {

		var formSection = form.sections[i];
		
		var type = formSection.collapsible? 'collapsible' : '';
		if(formSection.rows.length > 0) {
			addFormSection(type,formSection.rows[0].cols.length,formSection.title);
			
			$formSection = $('#formEditor .formSection:last');

			for(j=0; j<formSection.rows[0].cols.length; j++) {

				var $col = $formSection.find('td:nth-child('+(j+1)+')');
				$col.width(formSection.rows[0].cols[j].width);

				for(k=0; k<formSection.rows[0].cols[j].items.length; k++) {
					// console.log(formSection.rows[0].cols[j].items[k]);
					var properties = formSection.rows[0].cols[j].items[k];
					var formItem = $('#editorFieldList').find('#'+properties.name);
					formItem.appendTo($col.find('.formSortable'))
						.data({'labelType':properties.labelType,'readOnly':properties.readOnly}).find('.formInputBox').resizable({
							grid: [5,10],
							handles: (formItem.find('textarea').length > 0)? 'e,se,s':'e',
							stop:function() { window.layoutChanged = true; }
							// helper:'resizeHelper'
						}).height(properties.height).width(properties.width).find('input,textarea,checkbox,select').attr('tabindex',properties.tabindex);
						
					setReadOnly(formItem,properties.readOnly);
					setLabelType(formItem,properties.labelType);
				}
			}
			setupColResizing($formSection.find('table'));
		}
	}
	window.layoutChanged = false;	// this is set to true by various functions above, needs to be reset
}