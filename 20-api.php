<?php
// SPECIFY THE FOLDER WHERE FILES WILL BE UPLOADED
$folder= "E:/08-Uploads/";

// MOVE THE UPLOADED FILE TO THE THE SPECIFIED FOLDER
// $_FILES["FILE"]["tmp_name"] IS THE TEMPORARY FILE NAME
// $_FILES["FILE"]["name"] IS THE ORIGINAL FILE NAME
move_uploaded_file($_FILES["file"]["tmp_name"], $folder . time() . "_". $_FILES["file"]["name"]);

