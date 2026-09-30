<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include file="GlobalVariables.asp"-->

 <title>Advertising Maintanance</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<%

Dim TotalCount
dim rowcount
dim EventID

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
EventID = Request.Form("EventID")

AdvertisingID=Request.Form("AdvertisingID") 
BusinessID=Request.Form("BusinessID") 
AddressID=Request.Form("AddressID") 
AdvertisingLevel=Request.Form("AdvertisingLevel") 
AdvertisinglevelID=Request.Form("AdvertisinglevelID") 
BusinessTypeID=Request.Form("BusinessTypeID") 
BusinessType=Request.Form("BusinessType") 
BusinessName=Request.Form("BusinessName") 
BusinessAddress=Request.Form("BusinessAddress") 
BusinessApt=Request.Form("BusinessApt") 
BusinessCity=Request.Form("BusinessCity") 
BusinessState=Request.Form("BusinessState") 
BusinessEmail=Request.Form("BusinessEmail") 
BusinessLogo=Request.Form("BusinessLogo") 
BusinessZip=Request.Form("BusinessZip") 
BusinessHours=Request.Form("BusinessHours")
PeopleFirstName=Request.Form("PeopleFirstName")
PeopleLastName=Request.Form("PeopleLastName") 
BusinessFax=Request.Form("BusinessFax") 
BusinessCell=Request.Form("BusinessCell")
BusinessPhone=Request.Form("BusinessPhone")
BusinessWebsite=Request.Form("BusinessWebsite")
BusinessWebsiteID=Request.Form("BusinessWebsiteID")
BusinessAddressID=Request.Form("BusinessAddressID")
BusinessPhoneID=Request.Form("BusinessPhoneID")
PeopleID=Request.Form("PeopleID")
Delete=Request.Form("Delete")
AdvertisingBoothQTY=Request.Form("AdvertisingBoothQTY")
SpecialRequests=Request.Form("SpecialRequests")
AdvertisingPaidAmount = Request.Form("AdvertisingPaidAmount")
AdvertisingPaidAmountMonth = Request.Form("AdvertisingPaidAmountMonth")
AdvertisingPaidAmountDay = Request.Form("AdvertisingPaidAmountDay")
AdvertisingPaidAmountYear = Request.Form("AdvertisingPaidAmountYear")
AdvertisingQTY = Request.Form("AdvertisingQTY")
if Delete = "Yes" then
	Query =  "Delete * From Advertising where AdvertisingID = " & AdvertisingID & ";" 
	Conn.Execute(Query) 
Else
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
	
	str1 = AdvertisingPaidAmount
	str2 = ","
	If InStr(str1,str2) > 0 Then
		AdvertisingPaidAmount= Replace(str1, ",", "")
	End If
	

'****************************************************************************************************
'  UPDATE THE BUSINESS WEBSITES INTO THE WEBSITES TABLE
'****************************************************************************************************
Query =  " UPDATE Websites Set Website = '" &  BusinessWebsite & "' " 
Query =  Query & " where WebsitesID = " & BusinessWebsiteID & ";"

'response.write("Query=" & Query )
Conn.Execute(Query) 

if len(AdvertisingQTYExtraTables) > 0 then
else
AdvertisingQTYExtraTables = 0
end if

'****************************************************************************************************
'  UPDATE THE Advertising TABLE
'****************************************************************************************************
response.write("AdvertisingPaidAmount=" & AdvertisingPaidAmount & "<br/>")

Query =  " UPDATE Advertising Set " 
if len(AdvertisingPaidAmount) > 0 then
	Query =  Query & " AdvertisingPaidAmount  = " &  AdvertisingPaidAmount & "," 
end if 
if len(AdvertisingPaidAmountMonth) > 0 then
	Query =  Query & " AdvertisingPaidAmountMonth  = " &  AdvertisingPaidAmountMonth & "," 
end if 
if len(AdvertisingPaidAmountDay) > 0 then
	Query =  Query & " AdvertisingPaidAmountDay  = " &  AdvertisingPaidAmountDay & "," 
end if 
if len(AdvertisingPaidAmountYear) > 0 then
	Query =  Query & " AdvertisingPaidAmountYear  = " &  AdvertisingPaidAmountYear & "," 
end if 

Query =  Query & " AdvertisingQTY  = '" & AdvertisingQTY & "'," 
Query =  Query & " SpecialRequests  = '" &  SpecialRequests & "'," 
Query =  Query & " AdvertisinglevelID = " &  AdvertisinglevelID & " " 
Query =  Query & " where AdvertisingID = " & AdvertisingID & ";"

response.write("Query = " & Query & "<br/>")
Conn.Execute(Query) 

'**************************************************************************************************************
'  UPDATE THE  BUSINESS ADDRESSES INTO THE ADDRESS TABLE 
'**************************************************************************************************************
Query =  " UPDATE Address Set AddressStreet = '" &  BusinessAddress & "' ,"
Query =  Query & " AddressApt  = '" &  BusinessApt & "'," 
Query =  Query & " AddressCity  = '" &  BusinessCity & "'," 
Query =  Query & " AddressState  = '" &  BusinessState & "'," 
Query =  Query & " AddressZip = '" &  BusinessZip & "'," 
Query =  Query & " AddressCountry = '" &   BusinessCountry & "'" 
Query =  Query & " where AddressID = " & BusinessAddressID & ";" 
response.write("address update = " & Query & "<br>")

Conn.Execute(Query) 

'**************************************************************************************************************
'   UPDATE BUSINESS PHONE NUMBERS INTO THE PHONE TABLE
'**************************************************************************************************************

Query =  " UPDATE Phone Set Phone = '" &  BusinessPhone & "' ,"
Query =  Query & " Cellphone  = '" &  BusinessCell & "'," 
Query =  Query & " Fax  = '" &  BusinessFax & "'" 
Query =  Query & " where PhoneID = " & BusinessPhoneID & ";" 

response.write("<br>Phone Query = " & Query & "<br>")
Conn.Execute(Query) 

'**************************************************************************************************************
'   UPDATE PEOPLE TABLE
'**************************************************************************************************************
Query =  " UPDATE People Set PeopleFirstName = '" &  PeopleFirstName & "' ,"
Query =  Query & " PeopleLastName  = '" &  PeopleLastName & "'" 
Query =  Query & " where PeopleID = " & PeopleID & ";" 

Conn.Execute(Query) 

'**************************************************************************************************************
'   UPDATE THE BUSINESS INFORMATION INTO THE BUSINESS TABLE
'**************************************************************************************************************
Query =  " UPDATE Business Set BusinessTypeID = " &  BusinessTypeID & ", "
Query =  Query & " BusinessName = '" &  BusinessName & "'," 
Query =  Query & " BusinessWebsiteID = " & BusinessWebsiteID & "," 
Query =  Query & " BusinessEmail = '" &  BusinessEmail & "'," 
Query =  Query & " BusinessHours = '" &  BusinessHours & "'," 
Query =  Query & " AddressID = " &  BusinessAddressID & ","
Query =  Query & " PhoneID = " &  BusinessPhoneID & ""
Query =  Query & " where BusinessID = " & BusinessID & ";" 

Conn.Execute(Query) 

end if


response.redirect("AdvertisingEdit.asp?AdvertisingID=" & AdvertisingID & "&EventID=" & EventID & "&message=Update has been completed")

	
%>
 </Body>
</HTML>
