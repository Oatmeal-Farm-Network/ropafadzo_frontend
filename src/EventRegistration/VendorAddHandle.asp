<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Add a Vendor</title>
       <link rel="stylesheet" type="text/css" href="style.css">
</HEAD>

<BODY bgcolor = "white">

<!--#Include file="globalvariables.asp"--> 

<%
EventID= Request.Form("EventID")
response.write("Line 14 eventID = "  & EventID & "<br/>")
BusinessWebsite= Request.Form("BusinessWebsite")
BusinessAddress= Request.Form("BusinessAddress")
BusinessApt= Request.Form("BusinessApt")
BusinessCity= Request.Form("BusinessCity")
BusinessState= Request.Form("BusinessState")
BusinessZip= Request.Form("BusinessZip")
BusinessPhone= Request.Form("BusinessPhone")
BusinessCell= Request.Form("BusinessCell")
BusinessFax= Request.Form("BusinessFax")
VendorLevelID= Request.Form("VendorLevelID")
response.write("VendorLevelID = " & VendorLevelID &"<br/>")
BusinessName= Request.Form("BusinessName")
BusinessTypeID= Request.Form("BusinessTypeID")
BusinessHours= Request.Form("BusinessHours")
BusinessEmail= Request.Form("BusinessEmail")
BusinessCountry = Request.Form("BusinessCountry")
PeopleFirstName= Request.Form("PeopleFirstName")
PeopleLastName = Request.Form("PeopleLastName")
SpecialRequests = Request.Form("SpecialRequests")
VendorBoothQTY = Request.Form("VendorBoothQTY")
VendorPaidAmount= Request.Form("VendorPaidAmount")
'response.write("VendorPaidAmount = " & VendorPaidAmount & "<br/>")
VendorPaidAmountMonth= Request.Form("VendorPaidAmountMonth")
VendorPaidAmountDay= Request.Form("VendorPaidAmountDay")
VendorPaidAmountYear= Request.Form("VendorPaidAmountYear")
VendorBoothQTY = request.Form("VendorBoothQTY")
VendorQTYExtraTables = request.form("VendorQTYExtraTables")
if len(VendorQTYExtraTables)> 0 then
else
VendorQTYExtraTables = 0
end if

'response.write("VendorAddHandle VendorBoothQTY = " & VendorBoothQTY & "<br/>")

str1 = SpecialRequests
str2 = "'"
If InStr(str1,str2) > 0 Then
	SpecialRequests= Replace(str1, "'", "''")
End If

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
'response.write("B In VendorAddHandle BusinessPhone = " & Businessphone & "<br/>")

' get BusinessWebsiteID
' get PhoneID


'**************************************************************************************************************
'  INSERT CONTACT INTO PEOPLE TABLE
'**************************************************************************************************************

Query =  "INSERT INTO People (PeopleFirstName, PeopleLastName )" 
Query =  Query & " Values ('" & PeopleFirstName  & "'," 
Query =  Query & " '" & PeopleLastName & "')" 

Conn.Execute(Query) 
'response.write("VendorAddHandle People Query = " & Query & "<br/>")

'**************************************************************************************************************
'  INSERT BUSINESS WEBSITE INTO THE WEBSITES TABLE
'**************************************************************************************************************
Query =  "INSERT INTO Websites (Website)" 
Query =  Query + " Values ('" & BusinessWebsite  & "') "

Conn.Execute(Query) 
'response.write("VendorAddHandle website Query = " & Query & "<br/>")

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
'response.write("VendorAddHandle Address Query = " & Query & "<br/>")

'**************************************************************************************************************
'  INSERT BUSINESS PHONE NUMBERS INTO THE PHONE TABLE
'**************************************************************************************************************

Query =  "INSERT INTO Phone (Phone, Cellphone, Fax )" 
Query =  Query & " Values ('" & BusinessPhone   & "'," 
Query =  Query & " '" &  BusinessCell & "', " 
Query =  Query & " '" &  BusinessFax & "')" 

Conn.Execute(Query) 
'response.write("VendorAddHandle Phone Query = " & Query & "<br/>")

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
'response.write("VendorAddHandle BusinessWebsiteID = " & BusinessWebsiteID & "<br/>")

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
'response.write("VendorAddHandle BusinessAddressID = " & BusinessAddressID & "<br/>")

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
'response.write("VendorAddHandle BusinessPhoneID = " & BusinessPhoneID & "<br/>")

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
'response.write("VendorAddHandle PeopleID = " & PeopleID & "<br/>")

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
response.write("VendorAddHandle People Query = " & Query & "<br/>")

Conn.Execute(Query) 
response.write("eventId = " & eventID & "<br/>")


'**************************************************************************************************************
'  INSERT THE Vendor INFO
'**************************************************************************************************************
Query =  "INSERT INTO Vendor (BusinessID, AddressID,  VendorlevelID, "
'response.write("VendorlevelID = " & VendorlevelID & " VendorPaidAmount = " & VendorPaidAmount & "<br/>")
if len(VendorPaidAmount) > 0 then
	Query =  Query & " VendorPaidAmount , " 
end if 
if len(VendorPaidAmountMonth) > 0 then
	Query =  Query & " VendorPaidAmountMonth , " 
end if 
if len(VendorPaidAmountDay) > 0 then
	Query =  Query & " VendorPaidAmountDay , " 
end if 
if len(VendorPaidAmountYear) > 0 then
	Query =  Query & "  VendorPaidAmountYear , " 
end if 
Query = Query & " VendorBoothQty , " 
Query =  Query & " SpecialRequests, VendorQTYExtraTables, EventID )" 
Query =  Query & " Values (" & BusinessID & ", "
Query =  Query & " " & BusinessAddressID & ", "  
Query =  Query & " " & VendorLevelID & ","
If len(VendorPaidAmount) > 0 then
	Query =  Query & " " & VendorPaidAmount & "," 
end if
response.write("VendorPaidAmount = " & VendorPaidAmount & "<br/>")
if len(VendorPaidAmountMonth) > 0 then
	Query =  Query & " " & VendorPaidAmountMonth & ", " 
end if 
if len(VendorPaidAmountDay) > 0 then
	Query =  Query & " " & VendorPaidAmountDay & ", " 
end if 
if len(VendorPaidAmountYear) > 0 then
	Query =  Query & " " & VendorPaidAmountYear & "," 
end if 
Query = Query & " '" & VendorBoothQty  & "', " 
Query = Query & " '" & SpecialRequests  & "', " 
Query = Query & " '" & VendorQTYExtraTables  & "', " 
Query = Query & " " & EventID & " )" 

response.write("Line 327 Query = " & Query & "<br/>")
Conn.Execute(Query) 

response.redirect("vendoradd.asp?EventID=" & EventID & "&message=Your vendor has been added.")

%>

 </Body>
</HTML>
