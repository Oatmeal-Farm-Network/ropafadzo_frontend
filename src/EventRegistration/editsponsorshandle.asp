<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include file="GlobalVariables.asp"-->

 <title>Account Maintanance</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<%

Dim TotalCount
dim rowcount
dim EventID
dim SponsorID(10000)
dim BusinessID(10000)
dim AddressID(10000)
dim PeopleID(10000)
dim SponsorLevel(10000) 
dim SponsorshiplevelID(10000) 
dim BusinessTypeID(10000) 
dim BusinessType(10000) 
dim BusinessName(10000) 
dim BusinessAddressID(10000) 
dim BusinessAddress(10000) 
dim BusinessApt(10000) 
dim BusinessCity(10000) 
dim BusinessState(10000) 
dim BusinessEmail(10000) 
dim BusinessLogo(10000) 
dim BusinessZip(10000) 
dim BusinessHours(10000)
dim PeopleFirstName(10000)
dim PeopleLastName(10000) 
dim BusinessFax(10000) 
dim BusinessCell(10000)
dim BusinessPhone(10000)
dim BusinessWebsite(10000)
dim BusinessWebsiteID(10000)
dim BusinessPhoneID(10000)
dim BusinessCountry(10000)
dim Delete(10000)
dim SponsorPaidAmount(10000)
dim SponsorPaidAmountMonth(10000)
dim SponsorPaidAmountDay(10000)
dim SponsorPaidAmountYear(10000)
dim SponsorQTY(1000)

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
EventID = Request.Form("EventID")
rowcount = 1

response.write("EventID=" & EventID )
while (rowcount < TotalCount + 1)


SponsorIDcount = "SponsorID(" & rowcount & ")"
BusinessIDcount = "BusinessID(" & rowcount & ")"
AddressIDcount = "AddressID(" & rowcount & ")" 
SponsorLevelcount = "SponsorLevel(" & rowcount & ")" 
SponsorshiplevelIDcount = "SponsorshiplevelID(" & rowcount & ")" 
BusinessTypeIDcount = "BusinessTypeID(" & rowcount & ")" 
BusinessTypecount = "BusinessType(" & rowcount & ")" 
BusinessNamecount = "BusinessName(" & rowcount & ")" 
BusinessAddresscount = "BusinessAddress(" & rowcount & ")" 
BusinessAptcount = "BusinessApt(" & rowcount & ")" 
BusinessCitycount = "BusinessCity(" & rowcount & ")" 
BusinessStatecount = "BusinessState(" & rowcount & ")" 
BusinessEmailcount = "BusinessEmail(" & rowcount & ")" 
BusinessLogocount = "BusinessLogo(" & rowcount & ")" 
BusinessZipcount = "BusinessZip(" & rowcount & ")" 
BusinessHourscount = "BusinessHours(" & rowcount & ")"
PeopleFirstNamecount = "PeopleFirstName(" & rowcount & ")"
PeopleLastNamecount = "PeopleLastName(" & rowcount & ")" 
BusinessFaxcount = "BusinessFax(" & rowcount & ")" 
BusinessCellcount = "BusinessCell(" & rowcount & ")"
BusinessPhonecount = "BusinessPhone(" & rowcount & ")"
BusinessWebsitecount = "BusinessWebsite(" & rowcount & ")"
BusinessWebsiteIDcount = "BusinessWebsiteID(" & rowcount & ")"
BusinessAddressIDcount = "BusinessAddressID(" & rowcount & ")"
BusinessPhoneIDcount = "BusinessPhoneID(" & rowcount & ")"
BusinessCountrycount = "BusinessCountry(" & rowcount & ")"
PeopleIDcount = "PeopleID(" & rowcount & ")"
Deletecount = "Delete(" & rowcount & ")"
SponsorQTYcount = "SponsorQTY(" & rowcount & ")"
	
SponsorPaidAmountcount = "SponsorPaidAmount(" & rowcount & ")"
SponsorPaidAmountMonthcount = "SponsorPaidAmountMonth(" & rowcount & ")"
SponsorPaidAmountDaycount = "SponsorPaidAmountDay(" & rowcount & ")"
SponsorPaidAmountYearcount = "SponsorPaidAmountYear(" & rowcount & ")"
SponsorPaidAmount(rowcount)=Request.Form(SponsorPaidAmountcount)
SponsorPaidAmountMonth(rowcount)=Request.Form(SponsorPaidAmountMonthcount)
SponsorPaidAmountDay(rowcount)=Request.Form(SponsorPaidAmountDaycount)
SponsorPaidAmountYear(rowcount)=Request.Form(SponsorPaidAmountYearcount)




SponsorID(rowcount)=Request.Form(SponsorIDcount) 
BusinessID(rowcount)=Request.Form(BusinessIDcount) 
AddressID(rowcount)=Request.Form(AddressIDcount) 
SponsorLevel(rowcount)=Request.Form(SponsorLevelcount) 
SponsorshiplevelID(rowcount)=Request.Form(SponsorshiplevelIDcount) 
BusinessTypeID(rowcount)=Request.Form(BusinessTypeIDcount) 
BusinessType(rowcount)=Request.Form(BusinessTypecount) 
BusinessName(rowcount)=Request.Form(BusinessNamecount) 
BusinessAddress(rowcount)=Request.Form(BusinessAddresscount) 
BusinessApt(rowcount)=Request.Form(BusinessAptcount) 
BusinessCity(rowcount)=Request.Form(BusinessCitycount) 
BusinessState(rowcount)=Request.Form(BusinessStatecount) 
BusinessEmail(rowcount)=Request.Form(BusinessEmailcount) 
BusinessLogo(rowcount)=Request.Form(BusinessLogocount) 
BusinessZip(rowcount)=Request.Form(BusinessZipcount) 
BusinessHours(rowcount)=Request.Form(BusinessHourscount)
PeopleFirstName(rowcount)=Request.Form(PeopleFirstNamecount)
PeopleLastName(rowcount)=Request.Form(PeopleLastNamecount) 
BusinessFax(rowcount)=Request.Form(BusinessFaxcount) 
BusinessCell(rowcount)=Request.Form(BusinessCellcount)
BusinessPhone(rowcount)=Request.Form(BusinessPhonecount)
BusinessWebsite(rowcount)=Request.Form(BusinessWebsitecount)
BusinessWebsiteID(rowcount)=Request.Form(BusinessWebsiteIDcount)
BusinessAddressID(rowcount)=Request.Form(BusinessAddressIDcount)
BusinessPhoneID(rowcount)=Request.Form(BusinessPhoneIDcount)
BusinessCountry(rowcount)=Request.Form(BusinessCountrycount)
PeopleID(rowcount)=Request.Form(PeopleIDcount)
Delete(rowcount)=Request.Form(Deletecount)
SponsorQTY(rowcount) = Request.Form(SponsorQTYcount)

	rowcount = rowcount +1
Wend

 rowcount =1

while (rowcount < TotalCount + 1)

if Delete(rowcount) = "Yes" then
	Query =  "Delete * From Sponsor where SponsorID = " & SponsorID(rowcount) & ";" 
	Conn.Execute(Query) 
Else
	str1 = BusinessName(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessName(rowcount)= Replace(str1, "'", "''")
	End If
		
	str1 = BusinessAddress(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessAddress(rowcount)= Replace(str1, "'", "''")
	End If

	str1 = BusinessApt(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessApt(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessCity(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessCity(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessEmail(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessEmail(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessHours(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessHours(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = PeopleFirstName(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleFirstName(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = PeopleLastName(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleLastName(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessWebsite(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessWebsite(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessZip(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessZip(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessCell(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessCell(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessFax(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		BusinessFax(rowcount)= Replace(str1, "'", "''")
	End If
	
	str1 = BusinessPhone(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Businessphone(rowcount)= Replace(str1, "'", "''")
	End If


'**************************************************************************************************************
'  UPDATE THE BUSINESS WEBSITES INTO THE WEBSITES TABLE
'**************************************************************************************************************
Query =  " UPDATE Websites Set Website = '" &  BusinessWebsite(rowcount) & "' " 
Query =  Query & " where WebsitesID = " & BusinessWebsiteID(rowcount) & ";"
'response.write("Query=" & Query )
Conn.Execute(Query) 

'**************************************************************************************************************
'  UPDATE THE SPONSORS TABLE
'**************************************************************************************************************
Query =  " UPDATE Sponsor Set " 
if len(SponsorPaidAmount(rowcount)) > 0 then
	Query =  Query & " SponsorPaidAmount  = " &  SponsorPaidAmount(rowcount) & "," 
end if 
if len(SponsorPaidAmountMonth(rowcount)) > 0 then
	Query =  Query & " SponsorPaidAmountMonth  = " &  SponsorPaidAmountMonth(rowcount) & "," 
end if 
if len(SponsorPaidAmountDay(rowcount)) > 0 then
	Query =  Query & " SponsorPaidAmountDay  = " &  SponsorPaidAmountDay(rowcount) & "," 
end if 
if len(SponsorPaidAmountYear(rowcount)) > 0 then
	Query =  Query & " SponsorPaidAmountYear  = " &  SponsorPaidAmountYear(rowcount) & "," 
end if 


Query =  Query & " SponsorQTY = " &  SponsorQTY(rowcount) & ", " 

Query =  Query & " SponsorshiplevelID = '" &  SponsorshiplevelID(rowcount) & "' " 
Query =  Query & " where SponsorID = " & SponsorID(rowcount) & ";"

response.write("Query=" & Query )
Conn.Execute(Query) 

'**************************************************************************************************************
'  UPDATE THE  BUSINESS ADDRESSES INTO THE ADDRESS TABLE 
'**************************************************************************************************************
Query =  " UPDATE Address Set AddressStreet = '" &  BusinessAddress(rowcount) & "' ,"
Query =  Query & " AddressApt  = '" &  BusinessApt(rowcount) & "'," 
Query =  Query & " AddressCity  = '" &  BusinessCity(rowcount) & "'," 
Query =  Query & " AddressState  = '" &  BusinessState(rowcount) & "'," 
Query =  Query & " AddressZip = '" &  BusinessZip(rowcount) & "'," 
Query =  Query & " AddressCountry = '" &   BusinessCountry(rowcount) & "'" 
Query =  Query & " where AddressID = " & BusinessAddressID(rowcount) & ";" 
response.write("address update = " & Query & "<br>")
Conn.Execute(Query) 

'**************************************************************************************************************
'   UPDATE BUSINESS PHONE NUMBERS INTO THE PHONE TABLE
'**************************************************************************************************************
Query =  " UPDATE Phone Set Phone = '" &  BusinessPhone(rowcount) & "' ,"
Query =  Query & " Cellphone  = '" &  BusinessCell(rowcount) & "'," 
Query =  Query & " Fax  = '" &  BusinessFax(rowcount) & "'" 
Query =  Query & " where PhoneID = " & BusinessPhoneID(rowcount) & ";" 
response.write("<br>Phone Query = " & Query & "<br>")
Conn.Execute(Query) 

'**************************************************************************************************************
'   UPDATE PEOPLE TABLE
'**************************************************************************************************************
Query =  " UPDATE People Set PeopleFirstName = '" &  PeopleFirstName(rowcount) & "' ,"
Query =  Query & " PeopleLastName  = '" &  PeopleLastName(rowcount) & "'" 
Query =  Query & " where PeopleID = " & PeopleID(rowcount) & ";" 
Conn.Execute(Query) 

'**************************************************************************************************************
'   UPDATE THE BUSINESS INFORMATION INTO THE BUSINESS TABLE
'**************************************************************************************************************
Query =  " UPDATE Business Set BusinessTypeID = " &  BusinessTypeID(rowcount) & ", "
Query =  Query & " BusinessName = '" &  BusinessName(rowcount) & "'," 
Query =  Query & " BusinessWebsiteID = " & BusinessWebsiteID(rowcount) & "," 
Query =  Query & " BusinessEmail = '" &  BusinessEmail(rowcount) & "'," 
Query =  Query & " BusinessHours = '" &  BusinessHours(rowcount) & "'," 
Query =  Query & " AddressID = " &  BusinessAddressID(rowcount) & ","
Query =  Query & " PhoneID = " &  BusinessPhoneID(rowcount) & ""
Query =  Query & " where BusinessID = " & BusinessID(rowcount) & ";" 
Conn.Execute(Query) 
end if

	  rowcount= rowcount +1
	Wend

    response.redirect("SponsorEdit.asp?EventID=" & EventID)

%>
 </Body>
</HTML>
