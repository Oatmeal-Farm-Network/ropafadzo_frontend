<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<title>Sign In - Online Event Registration</title>
<meta name="author" content="Sign In - Online Event Registration">
<meta name="keywords" content="Online Event Registration,
Event Registration,
Sign in,
Alpacas,
Livestock,
Alpaca Event Registration">
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="author" content="The Andresen Group">
<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" /> 
<link rel="stylesheet" type="text/css" href="Style.css">
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<!--#Include file="Header.asp"-->

<% Action = Request.querystring("Action") 
ReturnFileName = Request.querystring("ReturnFileName")
ExistingAccount = Request.querystring("ExistingAccount")

if len(ReturnFileName) > 1 then
else
ReturnFileName = request.querystring("ReturnFileName")
end if 
ReturnEventID = Request.querystring("ReturnEventID") 

if len(Action) > 1 then
 Session("Action") = Action
end if


%>

   <br /><table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth -15%>"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Sign In</div></H1>
        </td></tr>
        <tr><td class = "roundedBottom" align = "center">
        
        <table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=screenwidth -40 %>" height = "250" align = "center" >
	<tr>
		<td class = "body2" align = "center" valign = "top" width = "400"><br /><br />
		   <% if ExistingAccount = "True" then %>	
	<table><tr><td align = "left" bgcolor = "#DBF5F2" class = "body"><blockquote><br /><h3><b>Account Already Exists</b></h3>
<b>An account with that email addres is already in our system, please log in below, <a href = "sendpassword.asp" class = "body">have your password sent to you </a> , or <a href = "SetupAccount.asp?ReturnFileName=<%=ReturnFileName%>&ReturnEventID=<%=ReturnEventID%>" class = "body">set up a new account</a>.</b></blockquote><br /></td></tr></table> 
	<% end if %>	
		    
		    
		    
<form  name=Login method="post" action="Handlelogin.asp?Action=<%=Action%>&ReturnFileName=<%=ReturnFileName%>&ReturnEventID=<%=ReturnEventID%>">
			
	 <h2><center>Already Have an Account?</center></h2>
	 If you already have an account please login in below:
			
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
  <tr>
    <td class = "body2" align = "right" width = "110"><div align ="Right">Email Address:&nbsp;</div></td>
    <td align = "left"><input name="Email" Value =""  size = "33" maxlength = "61"></td></tr>
   <tr><td class = "body2" align = "right" width = "110"><div align ="Right">Password:&nbsp;</div></td>
   <td align = "left"><input name="password" type = password Value =""  size = "34" maxlength = "61"></td>
   </tr>
   <tr>
     <td></td>
     <td  class = "body">
	
	<br>
    <input type="submit" class = "regsubmit2" value="Continue"  ><br>
    <br></form>
	Forgot your password? <a href = "sendpassword.asp" class = "body">Click Here.</a><br>
</td></tr></table>
		    
		 </td>
<% if screenwidth < 800 then%>
</tr>
<tr>
<td class = "body" valign = "top" width = "100%">
<% else %>
		 <td width = "2" bgcolor = "#DBF5F2" ></td>
		  <td width = "4" ></td>
		 <td class = "body" valign = "top" width = "48%">
<% end if %>
		 <br /><br />
		   <h2><center>First Time Logging In?</h2>
If you haven't set up an account with us before please select the button below to get started: <br>

<form  name=NewAccount method="post" action="SetupAccount.asp?ReturnFileName=<%=ReturnFileName%>&ReturnEventID=<%=ReturnEventID%>">


    <center><input type="submit" class = "regsubmit2" value="Set Up Account"  ><br></center>
</form>
		 <br />
		 		   <h2><center>Alpaca Infinity Members</h2>
		 If you already have an Alpaca Infinity account you can, and should, use your Alpaca Infinity account information.<br /><br />
		 </td>
	</tr>
</table>	
     
   		
	        </td>
        </tr>
       </table>		
			
<br /><br />

<!--#Include virtual="Footer.asp"--> </Body>
</HTML>