<?php require "authcheck.php"; ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BrdFeedr</title>
    <link href="css/brdfeedr.css" rel="stylesheet">
    <link rel="stylesheet" href="js/fancybox/source/jquery.fancybox.css?v=2.1.5" type="text/css" media="screen" />
</head>
<body>
    <div id="navbar">
      <table cellpadding="0" cellspacing="0" width="100%"><tr>
        <td valign="top" style="text-align:left; width:33%; padding:3px 0 0 5px;"><img src="img/icon.png" id="icon" style="position:relative; top:0px;" /> BrdFeedr</td>
        <td valign="top" width="33%">&nbsp;</td>       
        <td valign="top" style="text-align:right; width:33%; padding:5px 10px 0 0; font-size:11px;">
          <?php if(isset($_SESSION['screen_name'])){ ?>
            <img src="<?php echo $_SESSION['profile_image_url_https']; ?>" style="border-radius:2px; width:14px; height:14px;" /> <?php echo $_SESSION['screen_name']; ?>
          <?php } ?>
        </td>
      </tr></table>
    </div>
	<?php include "include/view/home.php"; ?>
    
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-50609638-1', 'brdfeedr.com');
      ga('send', 'pageview');

    </script>
    
</body>
</html>