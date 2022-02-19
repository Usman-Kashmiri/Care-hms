
  <?php include 'header.php';?>
  
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
            <!-- FORM  -->
            <form role="form" id="contact_form" class="contact-form" method="post" onSubmit="return false">
              <div class="row" id="d-flex">
                <div class="col-md-6">
                      <label id="label">Username:</label>
                        <input type="text" class="form-control col-sm-12" name="name" id="name" placeholder="Enter your name here">
                        <label id="label">Email:</label>
                        <input type="text" class="form-control col-sm-12" name="email" id="email" placeholder="Enter your email here">
                        <label id="label">Company:</label>
                        <input type="text" class="form-control col-12" name="company" id="company" placeholder="Enter your phone here">
                    <!-- <li class="col-sm-12">
                      <label id="label">
                        <input type="text" class="form-control" name="website" id="website" placeholder="Department">
                      </label>
                    </li> -->
                      <label id="label">Message:</label>
                        <textarea class="form-control class="col-sm-12"" name="message" id="message" rows="5" placeholder="Enter your message here"></textarea>
                    <div class="col-sm-12" id="btn-container">
                      <button type="submit" value="submit" class="btn" id="btn_submit" onClick="proceed();">SEND MESSAGE</button>
                    </div>
                </div>    
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    
    
    
    <!-- MAP -->
    <section class="container d-flex justify-content-center" id="map-section">
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14472.61938850968!2d67.0951547!3d24.9267943!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2c4b1fc512ab6bb!2sAptech%20Computer%20Education%20Gulshan-e-Iqbal%20Campus!5e0!3m2!1sen!2s!4v1644923787012!5m2!1sen!2s" width="100%" height="450" style="border-radius:25px; border:0;" allowfullscreen="" loading="lazy"></iframe>
    </section>
  </div>
  
  <!-- Footer -->

  <?php include 'footer.php';?>