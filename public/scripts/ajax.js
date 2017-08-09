/* global $ */

// ADDING NEW COMMENT
$("#new-comment-form").submit(function(event){
	event.preventDefault();
    var formData = $(this).serialize();
    var actionUrl = $(this).attr('action');

	$.post(actionUrl, formData, function(data){
//data here refers to the data sent to the form
		$(".comments").append(
		`
	 	
		
		<li class="comment">
                <p>  
                     <strong>
                      Submitted by ${data.author.username} 
                      <span class="pull-right">
                       ${data.created } 
                      </span>
                     </strong> 
                 </p>
                 <p> ${data.text} </p> 

                    <a href="#" class="btn btn-xs btn-warning edit-button"> Edit</a>
                    <form class="delete" action="${actionUrl +"/"+ data._id}" method="POST">
                     <button class="btn btn-xs btn-danger ">DELETE </button>
                    </form>
                    
                    <form action="${actionUrl +"/"+ data._id}?_method=PUT" method="POST" class="edit-comment-form" style="display:none">
                      <div class="row">
                        <div class="form-group col-md-9">
                            <textarea class="form-control" type="text"  name="comment[text]"> ${data.text}</textarea>
                        </div>
                        <div class="col-md-3">
                           <button class="btn btn-lg btn-primary btn-block"> SUBMIT</button> 
                        </div> 
                      </div>
                    </form>
                 
        </li>
		`
		)
		
		$("#new-comment-form").find('.form-control').val("") 
	})
})

// EDIT COMMENTS
$(".comments").on("click","li .edit-button",function(e){
    e.preventDefault();
	$(this).siblings('.edit-comment-form').toggle();
})


$('.comments').on('submit','.edit-comment-form',function(e){
	e.preventDefault();
	//serializing data from the form to a form that we can pass into the server
	var updatedComment = $(this).serialize();
	//getting the route of the PUT request from the action attribute of the form
	var actionUrl = $(this).attr('action');
	//we are selecting the parent li of the form we are editing, which is an li with class .list-group-item
	var $originalItem = $(this).parent('.comment');
	$.ajax({
		url: actionUrl,
		data: updatedComment,
		type: 'PUT',
		originalItem: $originalItem,

		//callback function to be run upon success
		success: function(data) {
			//this refers to the context of the AJAX request, data here refers to the object coming back from the server
			console.log(data.text)
			this.originalItem.html(
				`
                 <p>  
                     <strong>
                      Submitted by ${data.author.username} 
                      <span class="pull-right">
                       ${data.created} 
                      </span>
                     </strong> 
                 </p>
            
                 <p>${data.text}</p> 
              
                    <a href="#" class="btn btn-xs btn-warning edit-button"> Edit</a>
                    <form class="delete" action="/posts/${data._id}/comments/${data._id }" method="POST">
                     <button class="btn btn-xs btn-danger ">DELETE </button>
                    </form>
                  <form action="${actionUrl}" method="POST" class="edit-comment-form">
                      <div class="row">
                        <div class="form-group col-md-9">
                            <textarea class="form-control" type="text" name="comment[text]"> ${data.text} </textarea>
                        </div>
                        <div class="col-md-3">
                           <button class="btn btn-lg btn-primary btn-block"> SUBMIT</button> 
                        </div> 
                      </div>
                   </form>
				`
			)
		}
	})
})


//DELETE COMMMENTS


$('.comments').on('submit', '.delete', function (e) {
	e.preventDefault();
	var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
		var actionUrl = $(this).attr('action');
		var $itemToDelete = $(this).closest('.comment');
		$.ajax({
			url: actionUrl,
			type: 'DELETE',
			itemToDelete: $itemToDelete,
			success: function success(data) {
			    console.log("WERWER")
				this.itemToDelete.remove();
			}
		});
	} else {
		$(this).find('button').blur();
	}
});