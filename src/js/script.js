$(document).ready(function() {
	$("#form").submit(function() {
	var th = $(this);
	$.ajax({
	type: "POST",
	url: "mail.php",
	data: th.serialize()
	}).done(function() {
	alert("Форма отправлена");
	setTimeout(function() {
	th.trigger("reset");
	}, 1000);
	});
	return false;
	});
	$('body').scrollspy({ target: '#navbar' });
$('a[href^="#"]').click(function(){
var target = $(this).attr('href');
$('html, body').animate({scrollTop: $(target).offset().top}, 1000);
return false;
});
});
