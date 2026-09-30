
<% 'Body Data




strBody="<meta name='GENERATOR' content='MSHTML 8.00.6001.18259' />" & vbCrLf 
strBody= strBody & "<style type='text/css'>BODY {FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif; FONT-SIZE: 11px}A {FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: brown; FONT-SIZE: 11px; TEXT-DECORATION: none}A:visited {COLOR: #666666}A:hover {TEXT-DECORATION: underline}P {FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: #666666; FONT-SIZE: 11px; FONT-WEIGHT: normal; TEXT-DECORATION: none}H1 {FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: #666666; FONT-SIZE: 14px; FONT-WEIGHT: bold; TEXT-DECORATION: none}DIV.emailfooter {FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif; FONT-SIZE: 11px }DIV.emailfooter A {	FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: #ff6600; FONT-SIZE: 11px; TEXT-DECORATION: none}</style>" & vbCrLf 

strBody= strBody & "<table width='599' border='0' cellspacing='0' cellpadding='0' leftmargin='0' topmargin='0' marginwidth='0' marginheight='0' align = 'left'  valign ='top'><tbody><tr><td align = 'left'><font size='1'>Can't view this email? Please</font> <a href='http://www.theandresengroup.com/WebsiteTradeIn.asp'><font size='1'>click here.</font></a>"  & vbCrLf 

strBody= strBody & "<tr><td><a href ='http://www.theandresengroup.com/WebsiteTradeIn.asp'><img src = 'http://www.TheAndresenGroup.com/MailingImages/AGJanuary2013MassEmail.jpg' width = '599' height = '530' align = 'left' border = '0' /></a></td></tr>"  & vbCrLf 
 
strBody= strBody & "<tr><td><div id='fb-root'></div><div align = 'right'><a href='https://plus.google.com/116189005406453110631' rel='publisher' target = 'Blank'><img src = 'http://www.TheAndresenGroup.com/images/GooglePlusLogo.jpg' border = '0' alt = 'Find The Andresen Group on Google+' width = '22' height = '22'/></a><a href = 'http://www.facebook.com/pages/The-Andresen-Group/307347792614580' target = 'blank'><img src = 'http://www.TheAndresenGroup.com/images/Facebook_Logo.jpg' border = '0' width = '22' height = '22' /></a></div><br><font color='#000000' size='1' face='Arial'>To unsubscribe please go to </font><a href='http://www.theandresengroup.com/UnsubscribeEmails.asp'>www.theandresengroup.com/UnsubscribeEmails.asp</a><font color='#000000' size='1' face='Arial'> or send an email to </font><a href='mailto:ContactUS@TheAndresenGroup.com'><font color='#000000' size='1' face='Arial'>ContactUs@TheAndresenGroup.com</font></a><CRLF>.<CRLF></font><font style='FONT-SIZE: 10px' color='#636363' size='1' face='arial'><br /></font></p></td></tr></tbody></table>" & vbCrLf  

strBody= strBody & "</BODY></HTML>"  & vbCrLf 





'response.Write("strBody=" & strBody)



Set ObjSendMail = CreateObject("CDO.Message") 
     
'This section provides the configuration information for the remote SMTP server.
     
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2 'Send the message using the network (SMTP over the network).
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpserver") ="mail.theandresengroup.com" 'your mail server
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpserverport") = 25 
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpusessl") = False 'Use SSL for the connection (True or False)
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 60
     
' If your server requires outgoing authentication uncomment the lines below and use a valid email address and password.
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate") = 1 'basic (clear-text) authentication
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendusername") ="John@theandresengroup.com"
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendpassword") ="Jackson5"
     
ObjSendMail.Configuration.Fields.Update
     
'End remote SMTP server configuration section=
     
'ObjSendMail.To = strTo
'ObjSendMail.To = "john@theandresengroup.com"
ObjSendMail.To = "webartistsbiz@gmail.com"
ObjSendMail.bcc = "john@theandresengroup.com; andresengroup@yahoo.com"
'ObjSendMail.To =  "webartistsbiz@gmail.com"
ObjSendMail.Subject = strSubject
ObjSendMail.From =  "TheAndresenGroup <John@theandresengroup.com>"
     
' we are sending a text email.. simply switch the comments around to send an html email instead

'ObjSendMail.HTMLBody = strBody
ObjSendMail.TextBody = strBody
response.Write(strBody)  
ObjSendMail.Send
     
Set ObjSendMail = Nothing 


%>