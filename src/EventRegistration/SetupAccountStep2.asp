<html>

<head>

<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 

<!--#Include file="Scripts.asp"--> 

<%
ExistingSite = False
ReturnFileName = Request.querystring("ReturnFileName") 
ReturnEventID = Request.querystring("ReturnEventID") 
PeopleFirstName  =Request.Form("PeopleFirstName") 
PeopleLastName  =Request.Form("PeopleLastName") 
PeopleTitleID =Request.Form("PeopleTitleID") 
PeopleWebsite =Request.Form("PeopleWebsite") 
PeopleEmail =Request.Form("PeopleEmail") 
password =Request.Form("password") 
confirm  =Request.Form("confirm") 
AddressStreet = Request.Form("AddressStreet") 
AddressApt = Request.Form("AddressApt") 
AddressCity  = Request.Form("AddressCity")
AddressState  = Request.Form("AddressState")
AddressZip  = Request.Form("AddressZip")
PeoplePhone  = Request.Form("PeoplePhone")
PeopleCell  = Request.Form("PeopleCell")
PeopleFax  = Request.Form("PeopleFax")
PeopleID = Request.Form("PeopleID")

ExistingAccount = False
sql = "select * from People where Peopleemail = '" & Peopleemail & "'"
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		ExistingAccount = True
End If 

'response.write("peoplequery = " & sql )
rs.close



if ExistingAccount = False then
if len(PeopleID)> 0 then
sql = "select AddressID, WebsitesID from People where PeopleID = " & PeopleID & ""
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
		AddressID  =rs("AddressID") 
		WebsitesID  =rs("WebsitesID") 
End If 

'response.write("peoplequery = " & sql )
rs.close

else


end if

if len(PeopleID) > 0 then
ExistingSite = True
end if
Dim str1
Dim str2

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

if ExistingSite = False then
		Query =  "INSERT INTO Address (AddressStreet, AddressApt, AddressCity, AddressState, AddressZip)" 
	    Query =  Query + " Values ('" & AddressStreet  & "'," 
	    Query =  Query & " '" &  AddressApt & "', " 
		Query =  Query & " '" &  AddressCity & "', " 
		Query =  Query & " '" &  AddressState & "', " 
		Query =  Query & " '" &  AddressZip & "')" 

else
	Query =  " UPDATE Address Set AddressStreet = '" &  AddressStreet & "', " 
	Query =  Query & " AddressApt = '" &  AddressApt & "'," 
	Query =  Query & " AddressCity = '" &  AddressCity & "'," 
    Query =  Query & " AddressState = '" &  AddressState & "'," 
    Query =  Query & " AddressZip = '" &   AddressZip & "'" & " where AddressID = " & AddressID & ";" 

end if 
'response.write("Address AddressZip = " & AddressZip & "AddressCity = " & AddressCity &  "<br>")
'response.write("Address query = " & Query & "<br>")	

Conn.Execute(Query) 

if ExistingSite = False then
		Query =  "INSERT INTO Websites (Website)" 
		Query =  Query + " Values ('" & PeopleWebsite & "')" 
else
	Query =  " UPDATE Websites Set Website = '" &  PeopleWebsite & "' " 
	Query =  Query & " where WebsitesID = " & WebsitesID & ";" 

end if 

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




if ExistingSite = False then
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

else
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

end if 

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

If len(password)< 5 then
  response.redirect("SetupAccount.asp?PeopleID=" & PeopleID & "&Message=Your Password Must Be at Least 5 Charecters Long.")
end if

Session("LoggedIn") = true
 Response.Cookies("LoggedIn")= true
Response.Cookies("PeopleFirstName")= PeopleFirstName

 
 
 

if len(PeopleID) > 0 then
'response.write("PeopleID=" & PeopleID)	
'response.write("AddressID=" & AddressID)	
else
sql = "select PeopleID from People where AddressID = " & AddressID  & " order by PeopleID Desc;"

'response.write("sql=" & sql)	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleID = rs("PeopleID")
		session("PeopleID") = PeopleID
		Response.Cookies("PeopleID")= PeopleID
	End If 
rs.close

end if
 
'
'Remove second single quote before displaying data
'
str1 = PeopleFirstName
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeopleFirstName= Replace(str1,  str2, "'")
End If  

str1 = PeopleLastName
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeopleLastName= Replace(str1,  str2, "'")
End If  

str1 = PeopleTitleID
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeopleTitleID= Replace(str1,  str2, "'")
End If  

str1 = PeopleWebsite
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeopleWebsite= Replace(str1,  str2, "'")
End If  

str1 = PeopleEmail
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeopleEmail= Replace(str1,  str2, "'")
End If 

str1 = password
str2 = "''"
If InStr(str1,str2) > 0 Then
	password= Replace(str1,  str2, "'")
End If 

str1 = confirm
str2 = "''"
If InStr(str1,str2) > 0 Then
	confirm= Replace(str1,  str2, "'")
End If 

str1 = AddressStreet
str2 = "''"
If InStr(str1,str2) > 0 Then
	AddressStreet= Replace(str1,  str2, "'")
End If 

str1 = StreetApt
str2 = "''"
If InStr(str1,str2) > 0 Then
	StreetApt= Replace(str1,  str2, "'")
End If 

str1 = AddressApt 
str2 = "''"
If InStr(str1,str2) > 0 Then
	AddressApt= Replace(str1,  str2, "'")
End If

str1 = AddressCity
str2 = "''"
If InStr(str1,str2) > 0 Then
	AddressCity= Replace(str1,  str2, "'")
End If

str1 = AddressZip
str2 = "''"
If InStr(str1,str2) > 0 Then
	AddressZip= Replace(str1,  str2, "'")
End If

str1 = PeoplePhone
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeoplePhone= Replace(str1,  str2, "'")
End If

str1 = PeopleCell
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeopleCell= Replace(str1,  str2, "'")
End If

str1 = PeopleFax 
str2 = "''"
If InStr(str1,str2) > 0 Then
	PeopleFax= Replace(str1,  str2, "'")
End If

%>
	
<table border = "0" width = "900" align = "center"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=5>
	<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<H1>Your Information</H1>
		</td>
	</tr>
	
	<tr>
		<td class = "body2" colspan = "2" align = "center">
				Please review your information below: 

		</td>
	</tr>
	<tr>
		<td valign = "top">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#DBF5F3" width = "450" height = "180">
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>
<tr>
	<td class = "body2" align = "right" width = "120">
		First Name: &nbsp;
	</td>
	<td class = "body2" align = "left" >
		<%=PeopleFirstName%>
	</td>
</tr>
<tr>
				<td class = "body2" align = "right">
					Last Name: &nbsp;
				</td>
				<td class = "body2">
					<%=PeopleLastName%>
				</td>
			</tr>
			<tr>
				<td  class = "body2" align = "right">
					Title: &nbsp;
				</td>
				<td class = "body2" width = "350"  >
			<%=PeopleTitle %>
    	</td>
	</tr>
<tr>
	<td class = "body2" align = "right">
			Your Website: &nbsp;
		</td>
		<td class = "body2">
			http://<%=PeopleWebsite%>
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			Email: &nbsp;
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<%=PeopleEmail%>
		</td>
	</tr>
	<tr>
		<td class ="body2" valign = "top" colspan = "2" height = "72">
			<br>
		</td>
	</tr>
</table>

</td>
<td width = "50%" valign = "Top">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#DBF5F3" width = "450" height = "180">
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>
<tr>
						  <td   class = "body2" align = "right" width = "120">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<%=AddressStreet%>
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;

						</td>
						<td  valign = "top" class = "body2">
								<%=AddressApt%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2">
								<%=AddressCity%>
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=AddressState%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=AddressZip%>
							</td>
						</tr>

						<tr>
							<td   class = "body2" align = "right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=PeoplePhone%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=PeopleCell%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=PeopleFax%>
							</td>
						</tr>
						<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>
</table>
</td>
</tr>
</table>
<table width = "900"  align = "center" bgcolor = "#DBF5F3" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
	<td class ="body2" valign = "top"  align = "center">
			<h2><center>Make Change</center></h2>
			<a href = "SetupAccount.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>&ReturnFileName=<%=ReturnFileName%>&ReturnEventID=<%=ReturnEventID%>" class = "body2">Click here to go back and make changes.</a><br><br>
	</td>
	<td class ="body2" valign = "top"  align = "center">
		
   <% if session("Action")= "Register" then %>
   <a href = "RegSignup.asp?EventID=<%=session("EventID")%>" class = "body2"><h2><center>Register for an Event</center></h2></a>
			<a href = "RegSignup.asp?EventID=<%=session("EventID")%>" class = "body2">Click here to proceed to the next step in the registration process.</a><br><br>
  <% end if %>
   <% if session("Action")= "List" then %>
	<a href = "regcreateType.asp?PeopleID=<%=PeopleID%>" class = "body2"><h2><center>List an Event</center></h2></a>
			<a href = "regcreateType.asp?PeopleID=<%=session("PeopleID")%>" class = "body2">Click here to list your event.</a><br><br>
 <% end if %>
 
  <% if not(session("Action")= "List") and not(session("Action")= "Register") and len(ReturnFileName) > 1 then %>
	<a href = "<%=ReturnFileName%>?EventID=<%=ReturnEventID%>" class = "body2"><h2><center>Thanks for Setting Up Your Account</center></h2></a>
	<a href = "<%=ReturnFileName%>?EventID=<%=ReturnEventID%>" class = "body2">Click here to Proceed</a><br><br>
 <% end if %>


     <% if not(session("Action")= "List") and not(session("Action")= "Register") and len(ReturnFileName) < 1 then %>
	<a href = "Defualt.asp?PeopleID=<%=session("PeopleID")%>" class = "body2"><h2><center>Thanks for Logging In</center></h2></a>
			<a href = "Default.asp?PeopleID=<%=session("PeopleID")%>" class = "body2">Click here to return to our home page.</a><br><br>
 <% end if %>

		</td>
	</tr>
</table>
<% else 
 response.Redirect("regcreateSignIn.asp?ExistingAccount=True&ReturnFileName=" & ReturnFileName & "&ReturnEventID=" & EventID )
%>


<%end if %>
<br><br><br>

		<!--#Include file="Footer.asp"-->

</Body>
</HTML>

