<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>User Administration</title>
<link rel="stylesheet" type="text/css" href="style.css">
<!--#Include virtual="globalVariables.asp"--> 
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="Header.asp"-->
<!--#Include virtual="UsersHeader.asp"-->

<table border = "0" bordercolor = "bbbbbb" cellpadding=0 cellspacing=0 width = "980" align = "center">
 <tr>
		<td colspan = "9" align = "center">

<% Message = request.querystring("Message") 
   PeopleFirstName = request.querystring("PeopleFirstName")
    PeopleLastName = request.querystring("PeopleLastName")
    email = request.querystring("email")
    Message2 = request.querystring("Message2") 
    AccessLevel = request.querystring("AccessLevel")
if len(Message) > 5 then 
%>
 <table border = "0" bordercolor = "bbbbbb"  cellpadding=0 cellspacing=0 width = "900" >
 <tr>
	<td  Class = "body">
		<font color = "brown"><b>Please correct the following issue(s):<blockquote><%=Message %></blockquote></b></font>
   </td>
  </tr>
 </table>
<% end if 

if len(Message2) > 5 then 
%>
 <table border = "0" bordercolor = "bbbbbb"  cellpadding=0 cellspacing=0 width = "900" >
 <tr>
	<td  Class = "body">
		<font color = "brown"><b><%=Message2%></b></font>
   </td>
  </tr>
   </table>
<% end if %>

<!--#Include virtual="PeopleDataInclude.asp"--> 
<form name=myForm onSubmit="return validatePwd()" action= 'AdminMembersAddhandleform.asp' method = "post">
<table border = "0" bordercolor = "bbbbbb"  cellpadding=0 cellspacing=0 width = "900" >
 <tr>
		<td Class = "body" >
			<h2>Add a User</h2>
		</td>
	</tr>
	<tr>
		<td height = "1" ><img src = "images/px.gif"></td>
	</tr>
</table>
<table border = "0"  cellpadding=0 cellspacing=0 width = "900" bgcolor = "#D4D4D4">
  <tr>
		<td  colspan = "4" align = "right" class = "body">&nbsp;</td>
		
		</td>
	</tr>

	<td  align = "right" class = "body">
			First Name:
		</td>
		<td  align = "left" class = "body">
					<input name="PeopleFirstName" value= "<%=PeopleFirstName%>" size = "30">
		</td>
		<td  align = "right" class = "body">
		    Last Name:
		</td>
		<td  align = "left" class = "body">
		    <input name="PeopleLastName" value= "<%=PeopleLastName%>" size = "30">
		</td>

	</tr>
	<tr>
		<td  align = "right" class = "body">
			Email:
		</td>
		<td  align = "left" class = "body">
			<input name="email1" value= "<%=email%>" size = "30">
		</td>
		<td  align = "right" class = "body">
			Confirm Email:
		</td>
		<td  align = "left" class = "body">
			<input name="email2" value= "<%=email%>" size = "30">
		</td>
	</tr>
	<tr>
		<td  align = "right" class = "body">
			Password:
		</td>
		<td  align = "left" class = "body">
			<input name="pw1" value= "" type = "password" size = "30">
		</td>
		<td  align = "right" class = "body">
			Confirm Password:
		</td>
	<td  align = "left" class = "body">
				<input name="pw2" type = "password" value= "" size = "30">
		</td>
	</tr>
	<tr>
		<td  align = "right" class = "body"></td>
		<td colspan = "3" class = "body">
			<b><i>Password must be at least 6 charecters long, 12 charecters maximum, and have no spaces.</i></b><br><br>
		</td>
	</tr>
<tr>
		<td colspan = "4" valign = "middle" align = "center">
		
			<input type=submit value="Add User" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" Class = "regsubmit2" ><br>
<br>

	</td>
</tr>
</table>
</form>




<br><br>
</td>
</tr>
</table>
<!--#Include file="Footer.asp"--> 

</Body>
</HTML>