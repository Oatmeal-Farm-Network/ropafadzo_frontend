
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<title>Registry Login</title>
<meta name="subjects" content="Event Registration, Alpacas Shows" >
<meta name="author" content="Andresen Events" >
<link rel="stylesheet" type="text/css" href="iFramestyle.css">


<% bodywidth= "770"
textwidth = "750" 
backgroundcolor = "#FDF4DD" 
SecondaryColor = "#FDF4DD" %>


<% 
CreateAccount = "False" 
UpdateAccount= "False"
EventTypeID = Request.form("EventTypeID") 
Session("EventTypeID") = EventTypeID

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

	
ProceedToUpdate = False	
if len(PeopleFirstName) > 0 and len(PeopleLastName) > 0 and len(PeopleEmail) > 0 and len(Password) > 0 and len(confirmpassword) > 0 and NotInDB = True then
response.Write("success so far")

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
'response.write(sql)
		
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

'response.write("Address AddressZip = " & AddressZip & "AddressCity = " & AddressCity &  "<br>")
response.write("Address query = " & Query & "<br>")	

Conn.Execute(Query) 

	Query =  " UPDATE Websites Set Website = '" &  PeopleWebsite & "' " 
	Query =  Query & " where WebsitesID = " & WebsitesID & ";" 


'response.write("Website query = " & Query & "<br>")	

Conn.Execute(Query) 
 sql = "select AddressID from Address where AddressStreet = '" & AddressStreet & "' and AddressCity= '" & AddressCity & "' and AddressZip = '" & AddressZip  & "' order by AddressID Desc"
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		AddressID = rs("AddressID")
	End If 
rs.close

sql = "select WebsitesID from Websites where Website = '" & PeopleWebsite & "'"
'response.write(sql)
		
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



'response.write("People query = " & Query & "<br>")
		
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
		'response.write(sql)
		Set rs = Server.CreateObject("ADODB.Recordset")
	    rs.Open sql, conn, 3, 3   
		If Not rs.eof Then
			NotInDB = False
		end if 
	rs.close	
		
ProceedToAdd = False	
if len(PeopleFirstName) > 0 and len(PeopleLastName) > 0 and len(PeopleEmail) > 0 and len(Password) > 0 and len(confirmpassword) > 0 and NotInDB = True then
response.Write("success so far")

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

'response.write("Address AddressZip = " & AddressZip & "AddressCity = " & AddressCity &  "<br>")
'response.write("Address query = " & Query & "<br>")	

Conn.Execute(Query) 

		Query =  "INSERT INTO Websites (Website)" 
		Query =  Query & " Values ('" & PeopleWebsite & "')" 


'response.write("Website query = " & Query & "<br>")	

Conn.Execute(Query) 
 sql = "select AddressID from Address where AddressStreet = '" & AddressStreet & "' and AddressCity= '" & AddressCity & "' and AddressZip = '" & AddressZip  & "' order by AddressID Desc"
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		AddressID = rs("AddressID")
	End If 
rs.close

sql = "select WebsitesID from Websites where Website = '" & PeopleWebsite & "'"
'response.write(sql)
		
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
response.write("People query = " & Query & "<br>")
		
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
  	session("PeopleID") = PeopleID
end if

end if
end if 



CheckLogin = False
CheckLogin = request.Form("CheckLogin")
if CheckLogin = "True" then	
UID=Trim(Request.Form("UID"))
password=Trim(Request.Form("password"))
response.write("name=" & name)  
if len(name)> 0 then
  regaccessfound  = false
 else

	sql2 = "select * from People where Peopleemail = '" & UID & "' and (PeoplePassword = '" & password & "')"
response.write(sql2)
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




if len(PeopleID)> 0 then %>


<%
response.write("PeopleID=" & PeopleID )

	sql = "select Address.*, Websites.*, People.* from Address, Websites, People where People.AddressID = Address.AddressID and People.WebsitesID = Websites.WebsitesID and PeopleID = " & PeopleID & ""
	'response.write(sql)
		
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
		'response.write(sql)
		Set rs = Server.CreateObject("ADODB.Recordset")
	    rs.Open sql, conn, 3, 3   
		ExistingEvent = False
		If Not rs.eof Then
			PeopleTitle = rs("PeopleTitle")
		end if 
	end if
end if
%>
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" bgcolor = "<% =backgroundcolor%>">
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" bgcolor = "<% =backgroundcolor%>" width = "780">
	<tr>
		<td class ="body2" valign = "top" colspan = "2" ><br>
		<div align = "right"><a href = "http://www.Andresenevents.com" target = "_blank"><img src = "images/AELogo300px.png" width = "279" height = "155" border = "0" alt = "Andresen Events Online Event Registration" /></a></div>
		
			<% if len(PeopleID) < 1 then 
			%>
			<H1>Please Log In</H1>
			  <center>Before you can register for this event you need to log in. Please log in or create an account below.</center>
			<% else  %>
				<H1>Your Account</H1>
				To create your event please select the "Proceed to the Next Step" button at the bottom of this page.<br />
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
		
		 if  (ProceedToUpdate = False and UpdateAccount = "True") then%>
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
	

	<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" width = "780">
	<tr>
		<td class ="body2" valign = "top" width = "276" bgcolor = "<%=SecondaryColor %>" align = "center">

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "279" height = "155"><tr><td class = "body" colspan = "2" >		<form action= 'iFrameSignIn.asp' method = "post">
	<blockquote><center><H2>Existing Account</H2></center>
Enter your Andresen Events login information:<br /></blockquote>
</td></tr>


<tr><td class = "body"  align = "right" >
	E-Mail:
</td>
<td align = "left" valign = "top" >	
	<input type=text  name=UID value= "<%=PeopleEmail %>" SIZE = "30" ><br>
</td>
</tr>
<tr><td class = "body"  align = "right">
		Password:<br>
	</td>
	<td align = "left" valign = "top" >	
		<input type= password name=password value= "<%=password %>" SIZE = "12">
	</td>
</tr>
<tr>
	<td align = "center" valign = "top" colspan = "2">	
		<input type= "hidden" name="CheckLogin" value= "True" >
		<input type=submit value = "Login" class = "regsubmit2" size = "170"  >
	</td>
</tr>
<tr>
  <td class = "body" colspan = "2"><br />
 <blockquote> <center><h2>Forgot Your Password?</H2></center>
  <a href = "SendpasswordStep2.asp" class = "body" target = "blank">Click Here</a> to have your password emailed to you.</blockquote>
  </td>
</tr>
</table>
</form>
	
		</td>
		<td width = "5" bgcolor = "<%=SecondaryColor %>"><img src = "images/px.gif"  width = "4" height = "1" alt = "Event Registration with Andresen Events" /></td>
		<td class ="body2" valign = "top" width = "500" bgcolor = "<%=SecondaryColor %>">
		<form action= 'iFrameSignIn.asp' method = "post">
		<blockquote>
		<% if len(PeopleID) > 0 then %>
				<H2>Your Account Information</H2>
				If you wish you can update your account information below:<br />
		<% else %>
		<H2>New Account</H2>
		Fill out the form below to create an Andresen Events account:<br />
		<% end if  %>
			 (* Indicates Required Fields)
<% if len(Message) > 1 then %><br>
<font color = "red"><b><%=Message%></b></font>
<% end if %>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "500">
<tr>
				<td class = "body2" align = "right" >
				 <%  if len(PeopleFirstName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>First Name:* &nbsp;<%  if len(PeopleFirstName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font><% end if %>
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
					<input name="PeopleFirstName" Value ="<%=PeopleFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					<%  if len(PeopleLastName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>Last Name:* &nbsp;<%  if len(PeopleLastName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font ><% end if %>
				</td>
				<td class = "body2">
					<input name="PeopleLastName" Value ="<%=PeopleLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td  class = "body2" align = "right">
					Title: &nbsp;
				</td>
				<td class = "body2"   >
					<select size="1" name="PeopleTitleID">
						
<% if len(PeopleTitle) > 0 then %>
	<option value= "<%=PeopleTitleID %>" selected><%=PeopleTitle %></option>
<% else %>
	<option value= "5">N/A</option>
<% end if %>
<% 
  sql = "select * from PeopleTitleLookup where not PeopleTitle = 'N/A'"
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
		<option value= "<%=rs("PeopleTitleID") %>"><%=rs("PeopleTitle") %></option>
  <% 
  rs.movenext
  wend 
end if %>
 </select>
    	</td>
	</tr>
<tr>
	<td class = "body2" align = "right">
			Website: &nbsp;
		</td>
		<td class = "body2">
			http://<input name="PeopleWebsite" Value ="<%=PeopleWebsite%>"  size = "30" maxlength = "61">
		</td>
	</tr>
	

<tr>
						  <td   class = "body2" align = "right">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<input name="AddressStreet"  size = "30" value = "<%=AddressStreet%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2">
								<input name="AddressApt"  size = "30" value = "<%=AddressApt%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2">
								<input name="AddressCity"  size = "30" value = "<%=AddressCity%>">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="AddressState">
							<% If Len(AddressState) > 0 then%>
								<option value="<%=AddressState%>" selected><%=AddressState%></option>
							<% Else %>
								<option value="" selected>-----</option>
							<% End If %>
					<option value="AL">AL</option>
					<option  value="AK">AK</option>
					<option  value="AZ">AZ</option>
					<option  value="AR">AR</option>
					<option  value="CA">CA</option>
					<option  value="CO">CO</option>
					<option  value="CT">CT</option>
					<option  value="DE">DE</option>
					<option  value="DC">DC</option>
					<option  value="FL">FL</option>
					<option  value="GA">GA</option>
					<option  value="HI">HI</option>
					<option  value="ID">ID</option>
					<option  value="IL">IL</option>
					<option  value="IN">IN</option>
					<option  value="IA">IA</option>
					<option  value="KS">KS</option>
					<option  value="KY">KY</option>
					<option  value="LA">LA</option>
					<option  value="ME">ME</option>
					<option  value="MD">MD</option>
					<option  value="MA">MA</option>
					<option  value="MI">MI</option>
					<option  value="MN">MN</option>
					<option  value="MS">MS</option>
					<option  value="MO">MO</option>
					<option  value="MT">MT</option>
					<option  value="NE">NE</option>
					<option  value="NV">NV</option>
					<option  value="NH">NH</option>
					<option  value="NJ">NJ</option>
					<option  value="NM">NM</option>
					<option  value="NY">NY</option>
					<option  value="NC">NC</option>
					<option  value="ND">ND</option>
					<option  value="OH">OH</option>
					<option  value="OK">OK</option>
					<option  value="OR">OR</option>
					<option  value="PA">PA</option>
					<option  value="RI">RI</option>
					<option  value="SC">SC</option>
					<option  value="SD">SD</option>
					<option  value="TN">TN</option>
					<option  value="TX">TX</option>
					<option  value="UT">UT</option>
					<option  value="VT">VT</option>
					<option  value="VA">VA</option>
					<option  value="WA">WA</option>
					<option  value="WV">WV</option>
					<option  value="WI">WI</option>
					<option  value="WY">WY</option>
					<option  value=""></option>
					<option  value="ON">ON</option>
					<option  value="QC">QC</option>
					<option  value="BC">BC</option>
					<option  value="AB">AB</option>
					<option  value="MB">MB</option>
					<option  value="SK">SK</option>
					<option  value="NS">NS</option>
					<option  value="NB">NB</option>
					<option  value="NL">NL</option>
					<option  value="PE">PE</option>
					<option  value="NT">NT</option>
					<option  value="YK">YK</option>
					<option  value="NU">NU</option>

				</select>
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Postal Code: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="AddressZip"  size = "8" value = "<%=AddressZip%>">
			</td>
		</tr>
		<tr>
			<td  align = "right" class = "body2">
				<small>Country: </small>	
			</td>
			<td  align = "left" valign = "top" class = "body2">
					
				<select size="1" name="BusinessCountry">
					<option value="USA" selected>USA</option>
					<option value="Canada">Canada</option>
				</select>
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Phone: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="PeoplePhone"  size = "30" value = "<%=PeoplePhone%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Cell: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="PeopleCell"  size = "30" value = "<%=PeopleCell%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Fax: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="PeopleFax"  size = "30" value = "<%=PeopleFax%>">
			</td>
		</tr>
		<tr>
		<td   class = "body2" align = "right">
			<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %><font color = "brown"><% end if %>Email:* &nbsp;<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %></font><% end if %>
	
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="PeopleEmail"  size = "30" value = "<%=PeopleEmail%>">
		</td>
	</tr>
		<tr>
		<td   class = "body2" align = "right">
			<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %><font color = "brown"><% end if %>Confirm Email:* &nbsp;<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %></font><% end if %>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="confirmemail"  size = "30" value = "<%=confirmEmail%>">
		</td>
	</tr>
	<tr>
	<td class = "body2" align = "right" ><%  if len(password) < 6 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>Password:* &nbsp;<%  if len(password) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font ><% end if %></td>
	<td WIDTH = "300"><label><input name="password" type="password" value="<%=password%>" maxlength = 12 ></label></td>
	</tr>
	<tr>
	<td class = "body2" align = "right"><%  if len(password) < 6 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>Confirm Password:* &nbsp;<%  if len(password) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font ><% end if %></td>
	<td><label><input name="confirmpassword" type="password" value="<%=password%>"  maxlength = 12 ></label></td>
	</tr>
	<tr rowspan = "2">
	<td class = "body2" colspan = "2" align = "center">
		Password must be 5-12 characters long.
	</td>
	</tr>
	</table>
	
			<% CreateAccount = "False" 
UpdateAccount= "False" %>
		<% if len(PeopleID)>0 then %>
		<input type= "hidden" name="UpdateAccount" value= "True" >
		<input type= "hidden" name="CreateAccount" value= "False" >
	<% else %>
	<input type= "hidden" name="CreateAccount" value= "True" >
			<input type= "hidden" name="UpdateAccount" value= "False" >
    <% end if %>
			

	<center><% if len(PeopleID)>0 then %>
		<input type=submit value="Update Your Account" class = "regsubmit2" onclick="verify();">
	<% else %>
	<input type=submit value="Create Your Account"   class = "regsubmit2">
    <% end if %>
</center>	</form>	
		</td>
</tr>
</table>		

</body>
</html>