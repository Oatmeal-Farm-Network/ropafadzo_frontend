
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->


<title>Registry Login</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">

<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<table align = "center">
	<tr >
		<td align = "center">
      
<%
UID=Trim(Request.Form("UID")) 
password=Trim(Request.Form("password"))
Action = request.Querystring("Action")
if len(Action) < 1 then
  Session("Action") = Action
end if 

'Response.write("Action=" & Action)
	
name=Trim(Request.Form("name"))
'response.write("name=" & name)  
if len(name)> 0 then
  regaccessfound  = false
 else

	sql2 = "select * from People where Peopleemail = '" & UID & "' and (PeoplePassword = '" & password & "')"
'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	

	if Not rs2.eof Then
	numrecords = rs2.recordcount
	PeopleID = rs2("PeopleID")
	Session("PeopleID") = PeopleID
	Session("PeopleID")= rs2("PeopleID")
	Session("LoggedIn") = true
	regaccessfound  = True
	redirect = true
    end if 
rs2.close
Set conn = Nothing


	If regaccessfound  = True Then
	 		session("TempUID")= UID
			session("TempPassword")= password
			 
    	   	Response.Redirect("regHome.asp?PeopleID=" & session("PeopleID"))
	
	 end if

	End if
%>

</td>
	</tr>
</table>

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "700" height = "300">
	<tr>
	    <td class = "body"  height = "83" valign = "top" align = "center">
		<br><h1>Registry Login</H1>
		<br><b>Your username or password was incorrect. Please try again.</b>
			<%
			live = True
			
			If live = True Then %>
		
			<form action= 'reghandleLogin.asp' method = "post">
				<table>
					<tr>
						<td class = "body2" align = "right">
							Email:<br>
							Password:<br>
						</td>
						<td>	
							<input type=text  name=UID value= "" SIZE = "26" ><br>
							<input type= password name=password value= "" SIZE = "26"><br>
						</td>
					</tr>
				</table>
<input type= text name="name" value= "" style="width: 1px; border: 0px solid linen" SIZE = "3">
			<center><input type=submit value = "Login" class = "regsubmit2" size = "170" class = "regsubmit2" ></center>
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

		<TD class = "body" width = "200" valign = "top">	
			<br><br>
<br>
			
				<br><h2>Forgot Your Password?</H2>
			


			<a href = "regsendpassword.asp" class = "body">Click Here</a> to have your password emailed to you.
			
	  </TD>
	</tr>
</table>
<!--#Include file="Footer.asp"-->
</BODY>
</HTML>
