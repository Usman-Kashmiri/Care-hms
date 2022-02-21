<?php
include("dbconnection.php");
// $dt = date("Y-m-d");
// $tim = date("H:i:s");
?>
<!doctype html>
<html class="no-js" lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!-- <meta http-equiv="refresh" content="60" /> -->
<meta name="author" content="Usman Kashmiri" />
<!-- Document Title -->
<title>Care - HMS</title>

<!-- Favicon -->
<link rel="shortcut icon" href="assets/images/logo/logo 3.png" type="image/x-icon">

<!-- SLIDER REVOLUTION 4.x CSS SETTINGS -->
<link rel="stylesheet" type="text/css" href="rs-plugin/css/settings.css" media="screen" />

<!-- StyleSheets -->
<link rel="stylesheet" href="css/ionicons.min.css">
<link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="css/font-awesome.min.css">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/animate.css">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/responsive.css">

<!-- Fonts Online -->
<link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900|Raleway:200,300,400,500,600,700,800,900" rel="stylesheet">

<!-- JavaScripts -->
<!-- <script src="js/vendors/modernizr.js"></script> -->
<script src="js/wow.js"></script>
<script src="sweetalert2.min.js"></script>
<link rel="stylesheet" href="sweetalert2.min.css">
<style>
  .head-info li i:hover {
    transition:0.5s;
    transform: scale(1.1);
  }
  #navbar {
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width:992px) {
    section {
      padding: 20px !important;
    }
    .header-style-2 {
      justify-content: cemter;
    }
    #header-top .logo {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    .head-info, .head-info ul {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
  @media screen and (max-width:540px) {
    .head-info, .head-info ul {
      display: none;
    }
  }
</style>
</head>
<body>
  
  <!-- Header -->
  <header class="header-style-2">
    <div class="container" id="header-top">
      <div class="logo"> <a href="index.html"><img src="assets/images/logo/care logo 4.png" alt="" style="height: 51px;"></a> </div>
      <div class="head-info">
        <ul>
          <li style="display:flex;"><a href="tel:090078601"><i class="fa fa-phone"></i>
            <p>0900 - 78601<br>Care - HMS</a></p>
          </li>
          <li style="display:flex;"><a href="mailto:care_h@gmail.com"><i class="fa fa-envelope-o"></i>
            <p>care_h@gmail.com</a><br>
              <a href="mailto:info@care.com">info@care.com</a></p>
          </li>
          <li style="display:flex;"><a href="https://goo.gl/maps/jFs9522aA6crx82VA"><i class="fa fa-map-marker"></i>
            <p>Care Hospital<br>
             Karanchi</a></p>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Nav -->
    <nav class="navbar ownmenu">
      <div class="container" id="navbar">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-open-btn" aria-expanded="false"> <span><i class="fa fa-navicon"></i></span> </button>
        </div>
        
        <!-- NAV -->
        <div class="collapse navbar-collapse navbar-right" id="nav-open-btn">
          <ul class="nav">
            <li> <a href="index.php">Home </a></li>
            <li><a href="about.php">About</a></li>            
            <li><a href="patientappointment.php">Appointment </a></li>
            <li><a href="contact.php">Contact </a></li>
            <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown">Log In </a>
              <ul class="dropdown-menu multi-level" style="display: none;">
                <li><a href="adminlogin.php">Admin</a></li>
                <li><a href="doctorlogin.php">Doctor</a></li>
                <li><a href="patientlogin.php">Patient </a></li>
                
              </ul>
            </li>           
          </ul>
        </div>
      </div>
    </nav>
  </header>