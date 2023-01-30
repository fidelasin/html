$(document).ready(function() {

  
  $(document).on('click', '.btn-add', function(event) {
    event.preventDefault();
    var controlForm = $('.controls');
    var currentEntry = $(this).parents('.entry:first');
    var newEntry = $(currentEntry.clone()).appendTo(controlForm);
    newEntry.find('input').val('');
    controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
            
    var inputs = $('.controls .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'color[' + index + ']';
    });
  });
  $(document).on('click', '.btn-remove', function(event) {
    event.preventDefault();
    $(this).parents('.entry:first').remove();
    var inputs = $('.controls .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'color[' + index + ']';
    });
  });

  $(document).on('click', '.btn-add2', function(event) {
    event.preventDefault();
    var controlForm = $('.controls2');
    var currentEntry = $(this).parents('.entry:first');
    var newEntry = $(currentEntry.clone()).appendTo(controlForm);
    newEntry.find('input').val('');
    controlForm.find('.entry:not(:last) .btn-add2')
            .removeClass('btn-add2').addClass('btn-remove2')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
            
    var inputs = $('.controls2 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'productDimensions[' + index + ']';
    });
  });
  $(document).on('click', '.btn-remove2', function(event) {
    event.preventDefault();
    $(this).parents('.entry:first').remove();
    var inputs = $('.controls2 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'color[' + index + ']';
    });
  });
  

  
  $(document).on('click', '.btn-add3', function(event) {
    event.preventDefault();
    var controlForm = $('.controls3');
    var currentEntry = $(this).parents('.entry:first');
    var newEntry = $(currentEntry.clone()).appendTo(controlForm);
    newEntry.find('input').val('');
    controlForm.find('.entry:not(:last) .btn-add3')
            .removeClass('btn-add3').addClass('btn-remove3')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
            
    var inputs = $('.controls3 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'material[' + index + ']';
    });
  });
  $(document).on('click', '.btn-remove3', function(event) {
    event.preventDefault();
    $(this).parents('.entry:first').remove();
    var inputs = $('.controls3 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'material[' + index + ']';
    });
  });


  
  $(document).on('click', '.btn-add4', function(event) {
    event.preventDefault();
    var controlForm = $('.controls4');
    var currentEntry = $(this).parents('.entry:first');
    var newEntry = $(currentEntry.clone()).appendTo(controlForm);
    newEntry.find('input').val('');
    controlForm.find('.entry:not(:last) .btn-add4')
            .removeClass('btn-add4').addClass('btn-remove4')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
            
    var inputs = $('.controls4 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'type[' + index + ']';
    });
  });
  $(document).on('click', '.btn-remove4', function(event) {
    event.preventDefault();
    $(this).parents('.entry:first').remove();
    var inputs = $('.controls4 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'type[' + index + ']';
    });
  });


  
  $(document).on('click', '.btn-add5', function(event) {
    event.preventDefault();
    var controlForm = $('.controls5');
    var currentEntry = $(this).parents('.entry:first');
    var newEntry = $(currentEntry.clone()).appendTo(controlForm);
    newEntry.find('input').val('');
    controlForm.find('.entry:not(:last) .btn-add5')
            .removeClass('btn-add5').addClass('btn-remove5')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
            
    var inputs = $('.controls5 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'pictures[' + index + ']';
    });
  });
  $(document).on('click', '.btn-remove5', function(event) {
    event.preventDefault();
    $(this).parents('.entry:first').remove();
    var inputs = $('.controls5 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'pictures[' + index + ']';
    });
  });


  
  $(document).on('click', '.btn-add6', function(event) {
    event.preventDefault();
    var controlForm = $('.controls6');
    var currentEntry = $(this).parents('.entry:first');
    var newEntry = $(currentEntry.clone()).appendTo(controlForm);
    newEntry.find('input').val('');
    controlForm.find('.entry:not(:last) .btn-add6')
            .removeClass('btn-add6').addClass('btn-remove6')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
            
    var inputs = $('.controls6 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'video[' + index + ']';
    });
  });
  $(document).on('click', '.btn-remove6', function(event) {
    event.preventDefault();
    $(this).parents('.entry:first').remove();
    var inputs = $('.controls6 .form-control');
    $.each(inputs, function(index, item) {
      item.name = 'video[' + index + ']';
    });
  });


});

