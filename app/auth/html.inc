<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BrdFeedr</title>
    <link href="../css/brdfeeder.css" rel="stylesheet">
</head>
<body>
    <div id="navbar">
        <div style="position:relative; width:200px; margin: 0 auto;">
           <img src="../img/icon.png" id="icon" onClick="refresh_display();" /> BrdFeedr
        </div>
    </div>
    <div style="text-align:center; padding-top:20px;">
      <?php if (isset($menu)) { ?>
        <?php echo $menu; ?>
      <?php } ?>
    
    <?php if (isset($status_text)) { ?>
      <?php echo '<h3>'.$status_text.'</h3>'; ?>
    <?php } ?>
    <p>
      <pre>
        <?php print_r($content); ?>
      </pre>
    </p>

    </div>

  </body>
</html>
