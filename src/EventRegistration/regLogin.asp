<!DOCTYPE html>
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="/administration/adminGlobalVariables.asp"-->
<title>Registry Login</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
<link rel="stylesheet" type="text/css" href="Style.css">
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<% loginpage = True 
EventID = Request.querystring("EventID") 
Session("EventID") = EventID

'response.write("Session(LoggedIn) = " & Session("LoggedIn") )

	If Session("LoggedIn") = true then

    	  ' if request.querystring("Action")="edit"  then 
    	   	'Response.Redirect("regHome.asp?PeopleID=" & session("PeopleID"))
           'end if
    end if



%>
	<br>
	
		
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" >
<tr><td align = "center"><h1>Event Login</h1></td></tr></table>
		
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "900" height = "200">
	<tr><form action= 'reghandleLogin.asp' method = "post">
	    <td class = "body"  height = "83" valign = "top" align = "right">
<br><br>
			<%
			live = True
			
			If live = True Then %>
		

<table align = "right">
<tr><td class = "body"  align = "right">
	Email:
</td>
<td align = "center" valign = "top" >	
	<input type=text  name=UID value= "" SIZE = "36" ><br>
</td>
</tr>
<tr><td class = "body"  align = "right">
		Password:<br>
	</td>
	<td align = "center" valign = "top" >	
		<input type= password name=password value= "" SIZE = "36">
	</td>
</tr>
<tr><td class = "body"  align = "right">
		
	</td>
	<td align = "center" valign = "top" >	
		<input type= text name="name" value= "" style="width: 1px; border: 0px solid linen" SIZE = "3">
		<input type=submit value = "Login" class = "regsubmit2" size = "170"  >
	</td>
</tr>

</table>
</form>
	   	 <% End If %>
			<%
		
			If live = False Then %>
	   <center><b>Currently we are making improvements to the Registry area. It will be back up again soon. We are sorry for any inconvenience.</b></center>

	      <% End if%>
		</td>
		<td width = "5"><img src = "images/px.gif" height="0" width = "0"></td>
		<td width = "1" bgcolor = "black"><img src = "images/px.gif" height="0" width = "0"></td>
		<td width = "5"><img src = "images/px.gif" height="0" width = "0"></td>

		<TD class = "body" width = "440" valign = "top">	
			<br>
<h2>Forgot Your Password?</H2>
			


			<a href = "regsendpassword.asp" class = "body">Click Here</a> to have your password emailed to you.
			
	  </TD>
	</tr>
</table>	



<!--#Include virtual="Footer.asp"-->



</body>
</html>