<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Add a Sponsor</title>
       <link rel="stylesheet" type="text/css" href="style.css">
</HEAD>

<BODY bgcolor = "white">

		<!--#Include file="globalvariables.asp"--> 
<%
EventID= Request.Form("EventID")
BusinessWebsite= Request.Form("BusinessWebsite")
BusinessAddress= Request.Form("BusinessAddress")
BusinessApt= Request.Form("BusinessApt")
BusinessCity= Request.Form("BusinessCity")
BusinessState= Request.Form("BusinessState")
BusinessZip= Request.Form("BusinessZip")
BusinessPhone= Request.Form("BusinessPhone")
BusinessCell= Request.Form("BusinessCell")
BusinessFax= Request.Form("BusinessFax")
SponsorshipLevelID= Request.Form("SponsorshipLevelID")
BusinessName= Request.Form("BusinessName")
BusinessTypeID= Request.Form("BusinessTypeID")
BusinessHours= Request.Form("BusinessHours")
BusinessEmail= Request.Form("BusinessEmail")
BusinessCountry = Request.Form("BusinessCountry")
PeopleFirstName= Request.Form("PeopleFirstName")
PeopleLastName= Request.Form("PeopleLastName")
SponsorQTY = Request.Form("SponsorQTY")

SponsorPaidAmount= Request.Form("SponsorPaidAmount")
SponsorPaidAmountMonth= Request.Form("SponsorPaidAmountMonth")
SponsorPaidAmountDay= Request.Form("SponsorPaidAmountDay")
SponsorPaidAmountYear= Request.Form("SponsorPaidAmountYear")
				
				
str1 = BusinessName
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessName= Replace(str1, "'", "''")
End If


str1 = BusinessAddress
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessAddress= Replace(str1, "'", "''")
End If


str1 = BusinessApt
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessApt= Replace(str1, "'", "''")
End If



str1 = BusinessCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessCity= Replace(str1, "'", "''")
End If



str1 = BusinessEmail
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessEmail= Replace(str1, "'", "''")
End If



str1 = BusinessHours
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessHours= Replace(str1, "'", "''")
End If

str1 = PeopleFirstName
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleFirstName= Replace(str1, "'", "''")
End If

str1 = PeopleLastName
str2 = "'"
If InStr(str1,str2) > 0 Then
	PeopleLastName= Replace(str1, "'", "''")
End If


str1 = BusinessWebsite
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessWebsite= Replace(str1, "'", "''")
End If

str1 = BusinessZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessZip= Replace(str1, "'", "''")
End If

str1 = BusinessCell
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessCell= Replace(str1, "'", "''")
End If

str1 = BusinessFax
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessFax= Replace(str1, "'", "''")
End If


str1 = BusinessPhone
str2 = "'"
If InStr(str1,str2) > 0 Then
	Businessphone= Replace(str1, "'", "''")
End If

' get BusinessWebsiteID
' get PhoneID





'**************************************************************************************************************
'  INSERT CONTACT INTO PEOPLE TABLE
'**************************************************************************************************************
Query =  "INSERT INTO People (PeopleFirstName, PeopleLastName )" 
Query =  Query & " Values ('" & PeopleFirstName  & "'," 
Query =  Query & " '" & PeopleLastName & "')" 
Conn.Execute(Query) 

'**************************************************************************************************************
'  INSERT BUSINESS WEBSITE INTO THE WEBSITES TABLE
'**************************************************************************************************************
Query =  "INSERT INTO Websites (Website)" 
Query =  Query + " Values ('" & BusinessWebsite  & "') "
Conn.Execute(Query) 

'**************************************************************************************************************
'  INSERT BUSINESS ADDRESSES INTO THE ADDRESS TABLE 
'**************************************************************************************************************
Query =  "INSERT INTO Address(AddressStreet, AddressApt, AddressCity, AddressState, Addresscountry, AddressZip )" 
Query =  Query & " Values ('" & BusinessAddress  & "'," 
Query =  Query & " '" &  BusinessApt & "', " 
Query =  Query & " '" & BusinessCity & "', " 
Query =  Query & " '" &  BusinessState & "', " 
Query =  Query & " '" &  BusinessCountry & "', " 
Query =  Query & " '" &  BusinessZip & "')" 
Conn.Execute(Query) 

'**************************************************************************************************************
'  INSERT BUSINESS PHONE NUMBERS INTO THE PHONE TABLE
'**************************************************************************************************************
Query =  "INSERT INTO Phone (Phone, Cellphone, Fax )" 
Query =  Query & " Values ('" & BusinessPhone   & "'," 
Query =  Query & " '" &  BusinessCell & "', " 
Query =  Query & " '" &  BusinessFax & "')" 
Conn.Execute(Query) 

'**************************************************************************************************************
'  FIND THE WEBSITE ID 
'**************************************************************************************************************

sql = "select WebsitesID from websites where Website = '" & BusinessWebsite & "' order by WebsitesID Desc;" 
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessWebsiteID = rs("WebsitesID")
End If 

rs.close




'**************************************************************************************************************
'  FIND THE ADDRESS ID'
'**************************************************************************************************************

sql = "select * from Address where AddressStreet = '" & BusinessAddress  & "' and AddressApt = '" & BusinessApt & "' and  AddressCity = '" & BusinessCity & "' and AddressZip = '" & BusinessZip & "' order by AddressID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then
	BusinessAddressID = rs("AddressID")
end if
rs.close

'**************************************************************************************************************
'  FIND THE PHONE ID'S 
'**************************************************************************************************************

sql = "select * from Phone where Phone = '" & BusinessPhone  & "' and Cellphone = '" & BusinessCell & "' and  fax = '" & BusinessFax & "' order by PhoneID Desc"
'response.write("business phone sql = " & sql & "<br><br>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessPhoneID = rs("PhoneID")
End If 

rs.close

'**************************************************************************************************************
'  FIND THE PEOPLE ID 
'**************************************************************************************************************

sql = "select PeopleID from People where PeopleFirstName = '" & PeopleFirstName & "' and PeopleLastName = '" & PeopleLastName & "' order by PeopleID Desc"
'response.write("business phone sql = " & sql & "<br><br>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	PeopleID = rs("PeopleID")
End If 

rs.close

'**************************************************************************************************************
'  INSERT THE BUSINESS INFORMATION INTO THE BUSINESS TABLE
'**************************************************************************************************************

if BusinessTypeID > 0 then
else
  BusinessTypeID = 0
end if 

Query =  "INSERT INTO Business(BusinessTypeID, BusinessName, BusinessWebsiteID, BusinessEmail, BusinessHours, AddressID, Contact1PeopleID, PhoneID  )" 
Query =  Query & " Values (" & BusinessTypeID & ", "
Query =  Query & " '" & BusinessName & "', "  
Query =  Query & " " & BusinessWebsiteID & ", " 
Query =  Query & " '" &  BusinessEmail & "', " 
Query =  Query & " '" &  BusinessHours & "'," 
Query =  Query & " " & BusinessAddressID & "," 
Query =  Query & " " & PeopleID & "," 
Query =  Query & " " &  BusinessPhoneID & ")" 

response.write(Query)
Conn.Execute(Query) 

'**************************************************************************************************************
'  FIND THE BUSINESS ID
'**************************************************************************************************************

sql = "select BusinessID from Business where BusinessTypeID = " & BusinessTypeID   & " and BusinessName = '" & BusinessName & "' and BusinessEmail = '" & BusinessEmail & "' order by BusinessID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessID = rs("BusinessID")
End If 

rs.close





'**************************************************************************************************************
' UPDATE THE PEOPLE TABLE - ADD THE BUSINESSID
'**************************************************************************************************************
Query =  " UPDATE People Set BusinessID = '" &  BusinessID & "' "
Query =  Query & " where PeopleID = " & PeopleID & ";" 
Conn.Execute(Query) 

'**************************************************************************************************************
'  INSERT THE SPONSOR INFO
'**************************************************************************************************************

if len(SponsorQTY) > 0 then
else
   SponsorQTY = 1
end if 

Query =  "INSERT INTO Sponsor (BusinessID, AddressID,  SponsorshiplevelID,  "
if len(SponsorPaidAmount) > 0 then
	Query =  Query & " SponsorPaidAmount , " 
end if 

if len(SponsorPaidAmountMonth) > 0 then
	Query =  Query & " SponsorPaidAmountMonth , " 
end if 

if len(SponsorPaidAmountDay) > 0 then
	Query =  Query & " SponsorPaidAmountDay , " 
end if 

if len(SponsorPaidAmountMonth) > 0 then
	Query =  Query & " SponsorPaidAmountYear , " 
end if 

Query =  Query & " SponsorQTY, EventID )" 
Query =  Query & " Values (" & BusinessID & ", "
Query =  Query & " " & BusinessAddressID & ", "  
Query =  Query & " " & SponsorshipLevelID & "," 
if len(SponsorPaidAmount) > 0 then
	Query =  Query & " " & SponsorPaidAmount & "," 
end if 
if len(SponsorPaidAmountMonth) > 0 then
	Query =  Query & " " & SponsorPaidAmountMonth & ", " 
end if 

if len(SponsorPaidAmountDay) > 0 then
	Query =  Query & " " & SponsorPaidAmountDay & ", " 
end if 

if len(SponsorPaidAmountMonth) > 0 then
	Query =  Query & " " & SponsorPaidAmountYear & "," 
end if 

Query =  Query & " " & SponsorQTY & "," 
Query =  Query & " " & EventID & " )" 

response.write(Query)
Conn.Execute(Query) 

response.redirect("SponsorEdit.asp?EventID=" & EventID)
%>

 </Body>
</HTML>
