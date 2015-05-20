/**
 * Created by greg on 19.05.15.
 */
$(function () {
    $('#todoList').todoList({
        inputClass: 'form-control ',
        btnAddClass: 'btn btn-success btn-sm active ',
        inputGroupClass: 'form-group input-group ',
//            inputGroupBtnClass: 'input-group-btn',
        liTodoClass: 'col-md-12 list-group-item',
//            btnDoneTaskClass: 'glyphicon glyphicon-ok',
        btnRemoveTaskClass: 'glyphicon glyphicon-remove',
        btnEditTaskClass: 'btn btn-default',
        messageUserClass: ' text-center'
    });
});
