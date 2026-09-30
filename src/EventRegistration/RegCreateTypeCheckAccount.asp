<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">

<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Registry Login</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
<link rel="stylesheet" type="text/css" href="Style.css">
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<!--#Include file="Header.asp"-->

<% 
CreateAccount = "False" 
UpdateAccount= "False"
EventTypeID = Request.form("EventTypeID") 
if len(EventTypeID) < 1 then
EventTypeID = Request.Querystring("EventTypeID") 
end if
if len(EventTypeID) < 1 then
EventTypeID = Session("EventTypeID") 
end if
Session("EventTypeID") = EventTypeID

'response.Write("EventTypeID=" & EventTypeID )
UpdateAccount = Request.Form("UpdateAccount")
CreateAccount = request.form("CreateAccount")


if UpdateAccount = "True" then
AccountUpdated = False
PeopleFirstName  = request.Form("PeopleFirstName")
		PeopleLastName  =request.Form("PeopleLastName") 
		PeopleTitleID =request.Form("PeopleTitleID") 
		PeopleWebsite =request.Form("Website") 
		AddressStreet = request.Form("AddressStreet") 
		AddressApt = request.Form("AddressApt") 
		AddressCity  = request.Form("AddressCity")
		AddressState  = request.Form("AddressState")
		AddressZip  = request.Form("AddressZip")
		PeoplePhone  = request.Form("PeoplePhone")
		PeopleCell  = request.Form("PeopleCell")
		PeopleFax = request.Form("PeopleFax")
		password =request.Form("Password") 
		confirmpassword =request.Form("confirmpassword") 
		confirmEmail =request.Form("confirmEmail")
		peopleEmail =request.Form("peopleEmail")  

	
ProceedToUpdate = "False"	
if len(PeopleFirstName) > 0 and len(PeopleLastName) > 0 and len(PeopleEmail) > 0 and len(Password) > 0 and len(confirmpassword) > 0 and NotInDB = True then

  if (trim(Password) = trim(confirmPassword)) and (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) then
     ProceedToUpdate = True
  end if
end if


str1 = PeopleFirstName
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleFirstName= Replace(str1,  str2, "''")
End If  

str1 = PeopleLastName
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleLastName= Replace(str1,  str2, "''")
End If  


str1 = PeopleTitleID
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleTitleID= Replace(str1,  str2, "''")
End If  


str1 = PeopleWebsite
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleWebsite= Replace(str1,  str2, "''")
End If  

str1 = lcase(PeopleWebsite)
str2 = "http://"
If InStr(str1,str2) > 0 Then
	PeopleWebsite= right(PeopleWebsite, len(PeopleWebsite) - 7)
End If  


str1 = PeopleEmail
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleEmail= Replace(str1,  str2, "''")
End If 

str1 = password
str2 = "'"
If InStr(str1,str2) > 0 Then
	password= Replace(str1,  str2, "''")
End If 

str1 = confirm
str2 = "'"
If InStr(str1,str2) > 0 Then
	confirm= Replace(str1,  str2, "''")
End If 

str1 = AddressStreet
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressStreet= Replace(str1,  str2, "''")
End If 

str1 = StreetApt
str2 = "'"
If InStr(str1,str2) > 0 Then
	StreetApt= Replace(str1,  str2, "''")
End If 

str1 = AddressApt 
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressApt= Replace(str1,  str2, "''")
End If

str1 = AddressCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressCity= Replace(str1,  str2, "''")
End If

str1 = AddressZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressZip= Replace(str1,  str2, "''")
End If

str1 = PeoplePhone
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeoplePhone= Replace(str1,  str2, "''")
End If

str1 = PeopleCell
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleCell= Replace(str1,  str2, "''")
End If

str1 = PeopleFax 
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleFax= Replace(str1,  str2, "''")
End If
sql = "select AddressID, WebsitesID from People where PeopleID = " & PeopleID & ""
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		AddressID  =rs("AddressID") 
		WebsitesID  =rs("WebsitesID") 
End If 
rs.close

	Query =  " UPDATE Address Set AddressStreet = '" &  AddressStreet & "', " 
	Query =  Query & " AddressApt = '" &  AddressApt & "'," 
	Query =  Query & " AddressCity = '" &  AddressCity & "'," 
    Query =  Query & " AddressState = '" &  AddressState & "'," 
    Query =  Query & " AddressZip = '" &   AddressZip & "'" & " where AddressID = " & AddressID & ";" 

Conn.Execute(Query) 

	Query =  " UPDATE Websites Set Website = '" &  PeopleWebsite & "' " 
	Query =  Query & " where WebsitesID = " & WebsitesID & ";" 


Conn.Execute(Query) 
 sql = "select AddressID from Address where AddressStreet = '" & AddressStreet & "' and AddressCity= '" & AddressCity & "' and AddressZip = '" & AddressZip  & "' order by AddressID Desc"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		AddressID = rs("AddressID")
	End If 
rs.close

sql = "select WebsitesID from Websites where Website = '" & PeopleWebsite & "'"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		WebsitesID = rs("WebsitesID")
	End If 
rs.close


	Query =  " UPDATE People Set AddressID = " &  AddressID & ", " 
	Query =  Query & " WebsitesID = " &  WebsitesID & "," 
	Query =  Query & " PeopleTitleID  = " &  PeopleTitleID & "," 
    Query =  Query & " PeopleFirstName = '" &  PeopleFirstName & "'," 
    Query =  Query & " PeopleLastName = '" &  PeopleLastName & "'," 
    Query =  Query & " PeoplePhone = '" &  PeoplePhone & "'," 
    Query =  Query & " Peopleemail = '" &  Peopleemail & "'," 
    Query =  Query & " Peoplefax = '" &  Peoplefax & "',"
    Query =  Query & " PeopleCell = '" &  PeopleCell & "',"
    Query =  Query & " Peoplepassword = '" &  password & "'" 
    Query =  Query & " where PeopleID = " & PeopleID & ";" 

		
Conn.Execute(Query) 

 sql = "select PeopleID from People where AddressID = " & AddressID  & " order by PeopleID Desc;"

		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleID = rs("PeopleID")
		session("PeopleID") = PeopleID
	End If 
rs.close

AccountUpdated= True

end if 


if CreateAccount = "True" then
AccountCreated = False
        PeopleFirstName  = request.Form("PeopleFirstName")
		PeopleLastName  =request.Form("PeopleLastName") 
		PeopleTitleID =request.Form("PeopleTitleID") 
		PeopleWebsite =request.Form("Website") 
		AddressStreet = request.Form("AddressStreet") 
		AddressApt = request.Form("AddressApt") 
		AddressCity  = request.Form("AddressCity")
		AddressState  = request.Form("AddressState")
		AddressZip  = request.Form("AddressZip")
		PeoplePhone  = request.Form("PeoplePhone")
		PeopleCell  = request.Form("PeopleCell")
		PeopleFax = request.Form("PeopleFax")
		password =request.Form("Password") 
		confirmpassword =request.Form("confirmpassword") 
		confirmEmail =request.Form("confirmEmail")
		peopleEmail =request.Form("peopleEmail")  

NotInDB = True		
sql = "select * from People where ucase(peopleEmail)  = '" & ucase(trim(peopleEmail))  & "'"
		Set rs = Server.CreateObject("ADODB.Recordset")
	    rs.Open sql, conn, 3, 3   
		If Not rs.eof Then
			NotInDB = False
		end if 
	rs.close	
		
ProceedToAdd = False	
if len(PeopleFirstName) > 0 and len(PeopleLastName) > 0 and len(PeopleEmail) > 0 and len(Password) > 0 and len(confirmpassword) > 0 and NotInDB = True then

  if (trim(Password) = trim(confirmPassword)) and (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) then
     ProceedToAdd = True
  end if
end if


if  ProceedToAdd = True then

str1 = PeopleFirstName
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleFirstName= Replace(str1,  str2, "''")
End If  

str1 = PeopleLastName
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleLastName= Replace(str1,  str2, "''")
End If  


str1 = PeopleTitleID
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleTitleID= Replace(str1,  str2, "''")
End If  


str1 = PeopleWebsite
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleWebsite= Replace(str1,  str2, "''")
End If  

str1 = lcase(PeopleWebsite)
str2 = "http://"
If InStr(str1,str2) > 0 Then
	PeopleWebsite= right(PeopleWebsite, len(PeopleWebsite) - 7)
End If  


str1 = PeopleEmail
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleEmail= Replace(str1,  str2, "''")
End If 

str1 = password
str2 = "'"
If InStr(str1,str2) > 0 Then
	password= Replace(str1,  str2, "''")
End If 

str1 = confirm
str2 = "'"
If InStr(str1,str2) > 0 Then
	confirm= Replace(str1,  str2, "''")
End If 

str1 = AddressStreet
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressStreet= Replace(str1,  str2, "''")
End If 

str1 = StreetApt
str2 = "'"
If InStr(str1,str2) > 0 Then
	StreetApt= Replace(str1,  str2, "''")
End If 

str1 = AddressApt 
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressApt= Replace(str1,  str2, "''")
End If

str1 = AddressCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressCity= Replace(str1,  str2, "''")
End If

str1 = AddressZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	AddressZip= Replace(str1,  str2, "''")
End If

str1 = PeoplePhone
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeoplePhone= Replace(str1,  str2, "''")
End If

str1 = PeopleCell
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleCell= Replace(str1,  str2, "''")
End If

str1 = PeopleFax 
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleFax= Replace(str1,  str2, "''")
End If

		Query =  "INSERT INTO Address (AddressStreet, AddressApt, AddressCity, AddressState, AddressZip)" 
	    Query =  Query + " Values ('" & AddressStreet  & "'," 
	    Query =  Query & " '" &  AddressApt & "', " 
		Query =  Query & " '" &  AddressCity & "', " 
		Query =  Query & " '" &  AddressState & "', " 
		Query =  Query & " '" &  AddressZip & "')" 


Conn.Execute(Query) 

		Query =  "INSERT INTO Websites (Website)" 
		Query =  Query & " Values ('" & PeopleWebsite & "')" 


Conn.Execute(Query) 
 sql = "select AddressID from Address where AddressStreet = '" & AddressStreet & "' and AddressCity= '" & AddressCity & "' and AddressZip = '" & AddressZip  & "' order by AddressID Desc"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		AddressID = rs("AddressID")
	End If 
rs.close

sql = "select WebsitesID from Websites where Website = '" & PeopleWebsite & "'"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		WebsitesID = rs("WebsitesID")
	End If 
rs.close

		Query =  "INSERT INTO People (AddressID, WebsitesID, PeopleTitleID, PeopleFirstName, PeopleLastName, PeoplePhone, Peopleemail, Peoplefax, PeopleCell, PeoplePassword,  PeopleActive, PeopleCreationDate  )" 
		Query =  Query + " Values (" &  AddressID & ","		
		Query =  Query & " " &   WebsitesID & ", " 
		Query =  Query & " " &   PeopleTitleID & ", " 	
 		Query =  Query & " '" &  PeopleFirstName & "', " 
		Query =  Query & " '" &  PeopleLastName & "', " 
		Query =  Query & " '" &  PeoplePhone & "', " 
		Query =  Query & " '" &  Peopleemail & "', " 
		Query =  Query & " '" &  Peoplefax & "', " 
		Query =  Query & " '" &  Peoplecell & "', " 
		Query =  Query & " '" &  password & "', " 
		Query =  Query & " Yes, " 
		Query =  Query & " '" &  Now & "') "
		
Conn.Execute(Query) 


 sql = "select PeopleID from People where AddressID = " & AddressID  & " order by PeopleID Desc;"

		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleID = rs("PeopleID")
		session("PeopleID") = PeopleID
	End If 
rs.close

if len(PeopleID) > 0 then
  AccountCreated = True
end if

end if
end if 



CheckLogin = False
CheckLogin = request.Form("CheckLogin")
if CheckLogin = "True" then	
UID=Trim(Request.Form("UID"))
password=Trim(Request.Form("password"))
if len(name)> 0 then
  regaccessfound  = false
 else

	sql2 = "select * from People where Peopleemail = '" & UID & "' and (PeoplePassword = '" & password & "')"
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

End if

End if




if len(PeopleID) > 0 then 
  response.Redirect("RegCreate.asp?EventTypeID=" & EventTypeID)%>


<%	sql = "select Address.*, Websites.*, People.* from Address, Websites, People where People.AddressID = Address.AddressID and People.WebsitesID = Websites.WebsitesID and PeopleID = " & PeopleID & ""
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleFirstName  =rs("PeopleFirstName") 
		PeopleLastName  =rs("PeopleLastName") 
		PeopleTitleID =rs("PeopleTitleID") 
		PeopleWebsite =rs("Website") 
		PeopleEmail =rs("PeopleEmail") 
		password =rs("PeoplePassword") 
		AddressStreet = rs("AddressStreet") 
		AddressApt = rs("AddressApt") 
		AddressCity  = rs("AddressCity")
		AddressState  = rs("AddressState")
		AddressZip  = rs("AddressZip")
		PeoplePhone  = rs("PeoplePhone")
		PeopleCell  = rs("PeopleCell")
		PeopleFax  = rs("Peoplefax")
	End If 
	rs.close

	if len(PeopleTitleID) > 0 then 
		sql = "select PeopleTitle from PeopleTitleLookup where PeopleTitleID = " & PeopleTitleID & ""
		Set rs = Server.CreateObject("ADODB.Recordset")
	    rs.Open sql, conn, 3, 3   
		ExistingEvent = False
		If Not rs.eof Then
			PeopleTitle = rs("PeopleTitle")
		end if 
	end if
end if
%>
	<br>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth%>"><tr><td class = "roundedtop" align = "left">
	<% if len(PeopleID) < 1 then %>
			<H1>Please Log In</H1>
			<% else  %>
				<H1>Create an Event - Step2:  Verify Your Account</H1>
			<% end if %>
</td></tr>
<tr><td class = "roundedBottom">


		
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "left"  valign ="top" >
	<tr>
		<td class ="body" valign = "top" colspan = "2" align = "left">
			<% if len(PeopleID) < 1 then %>
			 <div align = "left">Before you can create your event you need to log in. Please log in or create an account below:</div>
			<% else  %>
				 <div align = "left">Please verify that your account information is correct below and then select the "Proceed to the Next Step" button at the bottom of this page.</div><br />
			<% end if %>
			
		<%
		if not(AccountCreated = True) and not(AccountUpdated = True) then
		
		 if (ProceedToAdd = False and CreateAccount="True")  then%>
		 <%  if NotInDB = False or len(PeopleFirstName) < 1 or len(PeopleLastName) < 1 or  len(PeopleEmail) < 5 or len(Password) < 6 or not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) or not (trim(Password) = trim(confirmPassword)) then %>
	
		<font color = "brown"><b>Your Account Was Not Created.</b><br />
		Please resolve the following issues and reselect the "Create Your Account" button:
		<ul><%  if NotInDB = False then %>
		  <li>There already is an account with that E-Mail address. Please log in with your existing account or use a different E-Mail address.</li>
		<% end if %>
		 <%  if len(PeopleFirstName) < 1 then %>
		  <li>Please enter a first name.</li>
		<% end if %>
		<%  if len(PeopleLastName) < 1 then %>
		  <li>Please enter a last name.</li>
		<% end if %>
		<%  if len(PeopleEmail) < 5 then %>
		  <li>Please enter an valid E-Mail address.</li>
		<% end if %>
			
		<%  if len(Password) < 6 then %>
		  <li>Please enter a valid password. Passwords must be at least 5 characters long.</li>
		<% end if %>
		 <%  if not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) then %>
		     <li>Please enter matching E-Mail addresses.</li>
		 <% end if %>
		<%  if not (trim(Password) = trim(confirmPassword)) then %>
		     <li>Please enter a matching passwords.</li>
		 <% end if %>

		</ul>
       
		</font>	
		<% end if  %>
		<% end if  
		end if
		
		
		if not(AccountUpdated = True) then
		
		 if  (ProceedToUpdate = "False" and UpdateAccount = "True") then%>
		  <%  if len(PeopleFirstName) < 1 or  len(PeopleLastName) < 1 or len(PeopleEmail) < 5 or len(Password) < 6 or (not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))))  or (not (trim(Password) = trim(confirmPassword))) then %>
		 
		<font color = "brown"><b>Your Account Was Not Updated.</b><br />
		Please resolve the following issues and reselect the "Update Your Account" button:
		<ul>
		 <%  if len(PeopleFirstName) < 1 then %>
		  <li>Please enter a first name.</li>
		<% end if %>
		<%  if len(PeopleLastName) < 1 then %>
		  <li>Please enter a last name.</li>
		<% end if %>
		<%  if len(PeopleEmail) < 5 then %>
		  <li>Please enter an valid E-Mail address.</li>
		<% end if %>
			
		<%  if len(Password) < 6 then %>
		  <li>Please enter a valid password. Passwords must be at least 5 characters long.</li>
		<% end if %>
		 <%  if not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) then %>
		     <li>Please enter matching E-Mail addresses.</li>
		 <% end if %>
		<%  if not (trim(Password) = trim(confirmPassword)) then %>
		     <li>Please enter a matching passwords.</li>
		 <% end if %>

		</ul>
       
		</font>	
		<% end if  %>
		<% end if  %>
		
				<% end if  %>
		
			<% if AccountCreated = True and CreateAccount="True" then%>
			<b>Your Account Was Created.</b>
			<% end if %>
			
		<%
		 if AccountUpdated = "True" and UpdateAccount="True" then%>
			<b>Your Account Was Updated.</b>
			<% end if %>
			
			
	<br />
    	</td>
</tr></table>
	

	<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" width = "<%=screenwidth -60%>">
	<tr>
		<td class ="body2" valign = "top"   align = "center" valign = "top">

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "100%" height = "200"><tr><td class = "body" colspan = "2" align = "left">		
<form action= 'RegCreateTypeCheckaccount.asp?EventType=<%=EventTypeID %>' method = "post">
	<br><H2>Already Have An Account?</H2>
<div align = "left">If you already have an account then please enter your email and password below:</div><%
 if regaccessfound  = False  and CheckLogin = "True" then %>
<font color = "maroon"><b>The email E-Mail / Password combination that you entered does not match our records.</b></font>
<%password = ""
end if %>
</td></tr>


<tr><td class = "body"  align = "right" >
	E-Mail:
</td>
<td align = "left" valign = "top" >	
	<input type=text  name=UID value= "<%=PeopleEmail %>" SIZE = "36" ><br>
</td>
</tr>
<tr><td class = "body"  align = "right">
		Password:<br>
	</td>
	<td align = "left" valign = "top" >	
		<input type= password name=password value= "<%=password %>" SIZE = "36">
	</td>
</tr>
<tr>
	<td align = "center" valign = "top" colspan = "2">	
		<input type= "hidden" name="CheckLogin" value= "True" >
		<input type=submit value = "Login" class = "regsubmit2" size = "170"  >
	</td>
</tr>
<tr>
  <td class = "body" colspan = "2">
  <h2>Forgot Your Password?</H2>
  <a href = "sendpassword.asp" class = "body" >Click Here</a> to have your password emailed to you.
  </td>
</tr>
</table>
</form>
	</blockquote>
		</td>
		<td width = "1" bgcolor = "ababab"><img src = "images/px.gif"  width = "1" height = "1" alt = "Event Registration with Andresen Events" /></td>
		<td class ="body2" valign = "top" width = "50%" >
		<form action= 'RegCreateTypeCheckaccount.asp' method = "post">
		<blockquote><br>
		<% if len(PeopleID) > 0 then %>
				<H2>Your Account Information</H2>
				If you wish you can update your account information below:<br />
		<% else %>
		<H2>Need to Create an Account?</H2>
		Please go to <a href = "SetupAccount.asp?ReturnFileName=RegCreateTypeCheckAccount.asp" class = "body">Sign Up</a> to create your account.
		
		

<% end if %>
		
			
<br /></td>
</tr>
</table><br /><br />

<!--#Include virtual="Footer.asp"-->



</body>
</html>