<html>
<title>Absolute path display utility</title>
<body bgcolor="#FFFFFF">

<p align="center"><font face="Verdana"><b>Internet Host Path Utility.</b></font></p>
<div align="center">
  <center>
  <table border="1" cellpadding="2" cellspacing="0" style="border-collapse: collapse" bordercolor="#000000" width="90%" id="AutoNumber1">
    <tr>
      <td width="50%"><font face="Verdana">
<B>Script Path=</B></font></td>
      <td width="50%"><font face="Verdana">
      <%= Request.Servervariables("PATH_inFO") %></font>&nbsp;</td>
    </tr>
    <tr>
      <td width="50%"><font face="Verdana">
<B>Translated Path=</B></font></td>
      <td width="50%"><font face="Verdana">
      <%= request.servervariables("PATH_TRANSLATED") %></font>&nbsp;</td>
    </tr>
    <tr>
      <td width="50%"><font face="Verdana">
<B>Application physical path=</B></font></td>
      <td width="50%"><font face="Verdana">
      <%= request.servervariables("APPL_PHYSICAL_PATH") %></font>&nbsp;</td>
    </tr>
    <tr>
      <td width="50%"><font face="Verdana">
<B>Host URL=</B></font></td>
      <td width="50%"><font face="Verdana">http://<%= request.servervariables("HTTP_HOST") %></font></td>
    </tr>
    <tr>
      <td width="50%"><font face="Verdana">
<B>Host IP address=</B></font></td>
      <td width="50%"><font face="Verdana">
      <%= request.servervariables("LOCAL_ADDR") %></font>&nbsp;</td>
    </tr>
    <tr>
      <td width="50%"><font face="Verdana">
<B>Your IP address=</B></font></td>
      <td width="50%"><font face="Verdana">
      <%= request.servervariables("REMOTE_ADDR") %></font>&nbsp;</td>
    </tr>
  </table>
  </center>
</div>
<font face="Verdana"><BR>
<br>
<br>
<br>
<br>

</font>

</body>
</html>