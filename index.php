  <?php include 'header.php'?>

  <link rel="stylesheet" href="css/index.css">

  <!-- style -->

  <style>
    .icons-container {
      padding: 20px;
    }
     @media screen and (max-width:992px) {
      .icons-container {
        grid-template-columns: auto auto;
      }
    }
  </style>

  <!-- Bnr Header -->
  <!-- Page Loader -->
<div id="loader">
  <div class="position-center-center">
    <img width="90%" src="assets/images/preloader/preloader.gif" alt="Preloader">
  </div>
</div>

  <section class="main-banner">
    <div class="tp-banner-container">
      <div class="tp-banner">
        <ul>
          <!-- SLIDE  -->
          <li data-transition="random" data-slotamount="7" data-masterspeed="300" data-saveperformance="off" > 
            <!-- MAIN IMAGE --> 
            <img src="images/hms.jpg"  alt="slider"  data-bgposition=" center center" data-bgfit="cover" data-bgrepeat="no-repeat"> 
            
            <!-- LAYER NR. 1 -->
            <div class="tp-caption sfl tp-resizeme" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="-120" 
                data-speed="800" 
                data-start="800" 
                data-easing="Power3.easeInOut" 
                data-splitin="chars" 
                data-splitout="none" 
                data-elementdelay="0.03" 
                data-endelementdelay="0.4" 
                data-endspeed="300"
                style="z-index: 5; font-size:50px; font-weight:500; color:black;  max-width: auto; max-height: auto; white-space: nowrap;">Care - Hospital Management System</div>
            
            <!-- LAYER NR. 2 -->
            <div class="tp-caption sfr tp-resizeme" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="-60" 
                data-speed="800" 
                data-start="1000" 
                data-easing="Power3.easeInOut" 
                data-splitin="chars" 
                data-splitout="none" 
                data-elementdelay="0.03" 
                data-endelementdelay="0.1" 
                data-endspeed="300" 
                style="z-index: 6; font-size:40px; color:gray; font-weight:500; white-space: nowrap;">We care about your healt...</div>
            
            <!-- LAYER NR. 3 -->
            <div class="tp-caption sfb tp-resizeme" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="0" 
                data-speed="800" 
                data-start="1200" 
                data-easing="Power3.easeInOut" 
                data-splitin="none" 
                data-splitout="none" 
                data-elementdelay="0.1" 
                data-endelementdelay="0.1" 
                data-endspeed="300" 
                style="z-index: 7;  font-size:22px; color:gray; font-weight:500; max-width: auto; max-height: auto; white-space: nowrap;">Best Hospitality Services in your town</div>
            
            <!-- LAYER NR. 4 -->
            <div class="tp-caption lfb tp-resizeme scroll" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="120"
                data-speed="800" 
                data-start="1300"
                data-easing="Power3.easeInOut" 
                data-elementdelay="0.1" 
                data-endelementdelay="0.1" 
                data-endspeed="300" 
                data-scrolloffset="0"
                style="z-index: 8;"><a href="patientappointment.php" class="btn">Book Now</a> </div>
          </li>
          
          <!-- SLIDE  -->
          <li data-transition="random" data-slotamount="7" data-masterspeed="300"  data-saveperformance="off" > 
            <!-- MAIN IMAGE --> 
            <img src="images/hms2.jpg"  alt="slider"  data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat"> 
            
            <!-- LAYER NR. 1 -->
            <div class="tp-caption sfl tp-resizeme" 
                data-x="left" data-hoffset="400" 
                data-y="center" data-voffset="-100" 
                data-speed="800" 
                data-start="800" 
                data-easing="Power3.easeInOut" 
                data-splitin="chars" 
                data-splitout="none" 
                data-elementdelay="0.03" 
                data-endelementdelay="0.4" 
                data-endspeed="300"
                style="z-index: 5; font-size:40px; font-weight:500; color:#000;  max-width: auto; max-height: auto; white-space: nowrap;">Best Diagnostic Centre </div>
            
            <!-- LAYER NR. 2 -->
            <div class="tp-caption sfr tp-resizeme" 
                data-x="left" data-hoffset="400" 
                data-y="center" data-voffset="-40" 
                data-speed="800" 
                data-start="800" 
                data-easing="Power3.easeInOut" 
                data-splitin="chars" 
                data-splitout="none" 
                data-elementdelay="0.03" 
                data-endelementdelay="0.4" 
                data-endspeed="300"
                style="z-index: 5; font-size:55px; font-weight:500; color:#000;  max-width: auto; max-height: auto; white-space: nowrap;">Care And Cure</div>
            
            <!-- LAYER NR. 3 -->
            <div class="tp-caption sfb tp-resizeme" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="30" 
                data-speed="800" 
                data-start="1400" 
                data-easing="Power3.easeInOut" 
                data-splitin="none" 
                data-splitout="none" 
                data-elementdelay="0.1" 
                data-endelementdelay="0.1" 
                data-endspeed="300" 
                style="z-index: 7; font-size:16px; color:#000; text-align:center; font-weight:500; line-height:26px; max-width: auto; max-height: auto; white-space: nowrap;">Improved diagnostic performance and heightened satisfaction of patients <br> and physicians delight.</div>
            
            <!-- LAYER NR. 4 -->
            <div class="tp-caption lfb tp-resizeme scroll" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="140"
                data-speed="800" 
                data-start="1600"
                data-easing="Power3.easeInOut" 
                data-elementdelay="0.1" 
                data-endelementdelay="0.1" 
                data-endspeed="300" 
                data-scrolloffset="0"
                style="z-index: 8;"><a href="contact.php" class="btn">CONTACT NOW</a> </div>
          </li>
          
          <!-- SLIDE  -->
          <li data-transition="random" data-slotamount="7" data-masterspeed="300"  data-saveperformance="off" > 
            <!-- MAIN IMAGE --> 
            <img src="images/hms3.jpg"  alt="slider"  data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat"> 
            
            <!-- LAYER NR. 2 -->
            <div class="tp-caption sfb tp-resizeme" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="-80" 
                data-speed="800" 
                data-start="800" 
                data-easing="Power3.easeInOut" 
                data-elementdelay="0.1" 
                data-endelementdelay="0.1" 
                data-endspeed="300" 
                data-scrolloffset="0"
                style="z-index: 6; font-size:40px; color:#000; font-weight:500; white-space: nowrap;"> Welcome To Our Research Center </div>
            
            <!-- LAYER NR. 3 -->
            <div class="tp-caption sfb tp-resizeme text-center" 
                data-x="center" data-hoffset="0" 
                data-y="center" data-voffset="-10" 
                data-speed="800" 
                data-start="1000" 
                data-easing="Power3.easeInOut" 
                data-elementdelay="0.1" 
                data-endelementdelay="0.1" 
                data-endspeed="300" 
                data-scrolloffset="0"
                style="z-index: 7; font-size:20px; font-weight:500; line-height:26px; color:#000; max-width: auto; max-height: auto; white-space: nowrap;">We work in a friendly and efficient using the latest <br>
              technologies and sharing our expertise.</div>
          </li>
        </ul>
      </div>
    </div>
  </section>
  
    <!-- home section starts  -->

    <section class="home" id="home sections">

        <div class="image wow fadeInLeft" data-wow-delay="0.2s">
            <img src="images/svgs/home-img.svg" alt="Doctor Svg">
        </div>

        <div class="content wow fadeInRight" data-wow-delay="0.2s">
        <h3>In an emergency? Need help now?</h3>
        <p>Instantly book an appoinment with just click...</p>
        <div class="cta-btn">
          <a href="patientappointment.php" id="btn" class="btn btn-primary btn-lg">Book an appoinment</a>
        </div>
            <!-- <a href="contact.php" class="btn"> contact us <span class="fa fa-chevron-right"></span> </a> -->
            <!-- <a href="booking.html" class="btn"> book appointment <span class="fa fa-chevron-right"></span> </a> -->
            <!-- <a href="patientappointment.php" class="btn"> login <span class="fa fa-chevron-right"></span> </a> -->
        </div>
    </section>

    <!-- home section ends -->

    <!-- Book an Appointment -->
    <!-- <section class="mt-5">

    </section> -->


    <!-- icons section starts  -->

    <section id="sections" class="icons-container">

        <div class="icons wow fadeInRight" data-wow-delay="0.2s">
            <i class="fa fa-user-md"></i>
            <h3>140+</h3>
            <p>doctors at work</p>
        </div>

        <div class="icons wow fadeInRight" data-wow-delay="0.3s">
            <i class="fa fa-users"></i>
            <h3>1040+</h3>
            <p>satisfied patients</p>
        </div>

        <div class="icons wow fadeInRight" data-wow-delay="0.4s">
            <i class="fa fa-bed"></i>
            <h3>500+</h3>
            <p>bed facility</p>
        </div>

        <div class="icons wow fadeInRight" data-wow-delay="0.5s">
            <i class="fa fa-hospital-o"></i>
            <h3>80+</h3> 
            <p>available hospitals</p>
        </div>

    </section>

    <!-- icons section ends -->

    <section id="sections" class="our-doctors my-5">
        <div class="container">
        <h1 class="heading"> meet our <span>specialist</span></h1>
        <div class="d-flex justify-content-center">
            <a href="doctors.html" class="btn doc-btn" id="btn"> View specialist <span class="fa fa-chevron-right"></span> </a>
            <img class="wow fadeInUp" data-wow-delay="0.3s" src="images/ourdoctors.jpg" alt="Our Doctors">
        </div>
        </div>
    </section>

  <!-- Content -->
  <div id="content"> 
    
    <!-- Intro -->
    <section style="padding: 50px 50px;">
      <div class="container">
        <div class="intro-main">
          <div class="row"> 
            
            <!-- Intro Detail -->
            <div class="col-md-8">
              <div class="text-sec">
                <h5>Health Check Ups</h5>
                <p>Besides providing world class clinical lab services, Labaid Diagnostic Centre houses a pool of doctors of different medical specialty to serve the ailing patients as outpatients. They are all reputed and respected in their medical specialty for outstanding clinical management</p>
                <ul class="row">
                  <li class="col-sm-6">
                    <h6> <i class="fa fa-check-circle"></i> EMERGENCY CASE</h6>
                    <p>Excepteur sint occaecat cupidatat non roident, 
                      sunt in culpa qui officia deserunt mollit </p>
                  </li>
                  <li class="col-sm-6">
                    <h6> <i class="fa fa-check-circle"></i> QUALIFIED DOCTORS</h6>
                    <p>Excepteur sint occaecat cupidatat non roident, 
                      sunt in culpa qui officia deserunt mollit </p>
                  </li>
                  <li class="col-sm-6">
                    <h6> <i class="fa fa-check-circle"></i> ONLINE APPOINTMENT</h6>
                    <p>Excepteur sint occaecat cupidatat non roident, 
                      sunt in culpa qui officia deserunt mollit </p>
                  </li>
                  <li class="col-sm-6">
                    <h6> <i class="fa fa-check-circle"></i> FREE MEDICAL COUNSELING</h6>
                    <p>Excepteur sint occaecat cupidatat non roident, 
                      sunt in culpa qui officia deserunt mollit </p>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Intro Timing -->
            <div class="col-md-4">
              <div class="timing"> <i class="lnr lnr-clock"></i>
                <ul>
                  <li> Monday <span>8.00 - 16.00</span></li>
                  <li> Tuesday <span>8.00 - 16.00</span></li>
                  <li> Wednesday <span>8.00 - 16.00</span></li>
                  <li> Thursday <span>8.00 - 16.00</span></li>
                  <li> Friday <span>8.00 - 16.00</span></li>
                  <li> Saturday <span>8.00 - 16.00</span></li>
                  <li> Sunday <span>8.00 - 16.00</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  

    
    <!-- DOCTOR LIST -->
    <section style="padding: 50px 50px;">
      <div class="container"> 
        
        <!-- Heading -->
        <div class="heading-block">
          <h2>Our Services</h2>
          <hr>
          <span>Duis autem vel eum iriure dolor in hendrerit n vuew lputate velit esse molestie conseu vel illum dolore eufe ugiat nulla facilisis at vero.</span> </div>
        
        <!-- Services -->
        <div class="services">
          <div class="row"> 
            
            <!-- Services -->
            <div class="col-md-4">
              <article>
                <div class="media-left"> <i class="flaticon-eye-2 icon"></i> </div>
                <div class="media-body">
                  <h6>Eye Specialist</h6>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit random text.</p>
                </div>
              </article>
            </div>
            
            <!-- Services -->
            <div class="col-md-4">
              <article>
                <div class="media-left"> <i class="flaticon-operating-room icon"></i> </div>
                <div class="media-body">
                  <h6>Operation Theater</h6>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit random text.</p>
                </div>
              </article>
            </div>
            
            <!-- Services -->
            <div class="col-md-4">
              <article>
                <div class="media-left"> <i class="flaticon-icu-monitor icon"></i> </div>
                <div class="media-body">
                  <h6>ICU Department</h6>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit random text.</p>
                </div>
              </article>
            </div>
            
            <!-- Services -->
            <div class="col-md-4">
              <article>
                <div class="media-left"> <i class="flaticon-doctor icon"></i> </div>
                <div class="media-body">
                  <h6>Qualified Doctors</h6>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit random text.</p>
                </div>
              </article>
            </div>
            
            <!-- Services -->
            <div class="col-md-4">
              <article>
                <div class="media-left"> <i class="flaticon-heartbeat icon"></i> </div>
                <div class="media-body">
                  <h6>Heart Problems</h6>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit random text.</p>
                </div>
              </article>
            </div>
            
            <!-- Services -->
            <div class="col-md-4">
              <article>
                <div class="media-left"> <i class="flaticon-stomach-2 icon"></i> </div>
                <div class="media-body">
                  <h6>Stomach Problems</h6>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit random text.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
   
    
    
  </div>
  
  <!-- Footer -->
<?php include 'footer.php';?>