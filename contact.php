  <?php   
   include 'header.php';

// errors variable
$nameError ="";
$emailError ="";
$msgError ="";

// answer variable
$name="";
$email="";
$msg="";

// $emailRegex="/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/";

if(isset($_POST['SUB']))
{
  if(empty($_POST["name"])) {
    $nameError = "Name is required...!";
  } 
  else {
   $name = $_POST["name"];
  }
  if(empty($_POST["email"])) {
    $emailError = "Email is required...!";
  } 
  else 
  {
    // if(!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/",$email)) 
    // {
    //   $emailError = "Invalid email format...!";
    // }
   $email = $_POST["email"];
  }
  if(empty($_POST["message"])) 
  {
    $msgError = "message is required...!";
  } 
    else 
  {
    $msg = $_POST["message"];
  }
}
if (isset($_POST['SUB']) && !empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['message'])) {
  $to = 'usmankashmiri378@gmail.com';
  $from = $email;
  $subject = $name.' Care - HMS';
  $message = $msg;
  
  $send = mail($to,$subject,$message,$from);
  
  if($send)
  {
    echo "<script>alert('Mail Send...!')</script>";
  }
  else
  {
    echo "<script>alert('Mail Not Send...!')</script>";
  }
}
?>
  
  <style>
    #label {
      font-weight: 500;
      font-size: 22px;
      color: black;
      text-align: start;
      margin: 8px 0;
    }
    #btn-container {
      display: flex;
      justify-content: end;
      margin-top: 8px;
      padding: 0;
    }
    #btn-container button {
      border-radius: 27px;
    }
    #d-flex {
      display: flex;
      justify-content: center;
    }
    #margin-padding {
      padding-top: 100px;
    }
    #map-section {
      margin-bottom: 100px;
    }
    .contact-info {
      display: flex;
      padding-top: 20px;
    }
        .d-flex {
          display: flex;
        }
        
        @media screen and (max-width:540px) {
          .contact-info {
      display: block;
    }
        }
      </style>

  <!-- Content -->
  <div id="content"> 
    
    <!-- Contact Us -->
    <section id="margin-padding"> 
      <!-- CONTACT FORM -->
      <div class="container"> 
        <!-- Tittle -->
        <div class="heading-block">
            <h4>GET IN TOUCH</h4>
            <hr>
          <div class="contact">
            <div class="contact-form"> 
                <div class="row">
                  <div class="col-md-6 col-sm-12">
                      <h4>Contact Us Via:</h4>
                      <div class="contact-info">
                          <div class="col-md-4 col-sm-12">
                            <ul>
                              <li class="d-flex"><a href="https://goo.gl/maps/jFs9522aA6crx82VA"><i class="fa fa-map-marker"></i>
                              <p>Care Hospital<br>
                              Karanchi</a></p>
                              </li>
                                <li class="d-flex">
                                <a href="tel:090078601"><i class="fa fa-phone"></i>
                                  <p>0900 - 78601<br>Care - HMS</a></p>
                                </li>
                                <li class="d-flex"><a href="mailto:care_h@gmail.com"><i class="fa fa-envelope-o"></i>
                              <p>care_h@gmail.com</a><br>
                                <a href="mailto:info@care.com">info@care.com</a></p>
                               </li>
                            </ul>
                          </div>
                          <div class="col-md-8 col-sm-12">
                          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14472.61938850968!2d67.0951547!3d24.9267943!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2c4b1fc512ab6bb!2sAptech%20Computer%20Education%20Gulshan-e-Iqbal%20Campus!5e0!3m2!1sen!2s!4v1644923787012!5m2!1sen!2s" width="100%" height="100%" style="border-radius:25px; border:0;" allowfullscreen="" loading="lazy"></iframe>
                          </div>
                      </div>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <!-- FORM  -->
                    <form role="form" name="contact_form" id="contact_form" class="contact-form" method="post">
                        <label id="label">Username:</label>
                          <input type="text" class="form-control col-sm-12" name="name" id="name" placeholder="Enter your name here">
                          <span class="text-danger"><?php echo $nameError; ?></span>
                          <label id="label">Email:</label>
                          <input type="text" class="form-control col-sm-12" name="email" id="email" placeholder="Enter your email here">
                          <span class="text-danger"><?php echo $emailError; ?></span>
                          <label id="label">Company:</label>
                          <input type="text" class="form-control col-12" name="company" id="company" placeholder="Enter your phone here">
                        <label id="label">Message:</label>
                          <textarea class="form-control class="col-sm-12"" name="message" id="message" rows="5" placeholder="Enter your message here"></textarea>
                          <span class="text-danger"><?php echo $msgError; ?></span>
                      <div class="col-sm-12" id="btn-container">
                        <button type="submit" value="submit" name="SUB" class="btn" id="btn_submit">SEND MESSAGE</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  
  <!-- Footer -->

  <?php include 'footer.php';?>