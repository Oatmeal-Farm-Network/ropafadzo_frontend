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
Dim RanchID(800)
Dim SponsorLevel(800)
Dim SponCompany(800)
Dim SponOwner(800)
Dim SponAddress1(800)
Dim SponAddress2(800)
Dim Sponcity(800)
Dim SponState(800)
Dim SponCountry(800)
Dim SponPhone(800)
Dim SponEmail(800)
Dim SponWebsite(800)
Dim SponZip(800)
Dim Show(800)
Dim SponID(800)

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1


while (rowcount < TotalCount + 1)
	SponIDcount = "SponID(" & rowcount & ")"	
	RanchIDcount = "RanchID(" & rowcount & ")"	
	SponsorLevelcount = "SponsorLevel(" & rowcount & ")"
	SponCompanycount = "SponCompany(" & rowcount & ")"
	SponOwnercount = "SponOwner(" & rowcount & ")"
	SponAddress1count = "SponAddress1(" & rowcount & ")"
	SponAddress2count = "SponAddress2(" & rowcount & ")"
    Sponcitycount = "Sponcity(" & rowcount & ")"
	SponStatecount = "SponState(" & rowcount & ")"
	SponCountrycount = "SponCountry(" & rowcount & ")"
	SponPhonecount = "SponPhone(" & rowcount & ")"
	SponEmailcount = "SponEmail(" & rowcount & ")"
	SponWebsitecount = "SponWebsite(" & rowcount & ")"
	SponZipcount = "SponZip(" & rowcount & ")"
	Showcount = "Show(" & rowcount & ")"

	SponID(rowcount)=Request.Form(SponIDcount) 
	RanchID(rowcount)=Request.Form(RanchIDcount) 
	SponsorLevel(rowcount)=Request.Form(SponsorLevelcount) 
	SponCompany(rowcount)=Request.Form(SponCompanycount )
	SponOwner(rowcount)=Request.Form(SponOwnercount )
	SponAddress1(rowcount)=Request.Form(SponAddress1count )
	SponAddress2(rowcount)=Request.Form(SponAddress2count )
	Sponcity(rowcount)=Request.Form(Sponcitycount )
	SponState(rowcount)=Request.Form(SponStatecount )
	SponCountry(rowcount)=Request.Form(SponCountrycount )
	SponPhone(rowcount)=Request.Form(SponPhonecount )
	SponEmail(rowcount)=Request.Form(SponEmailcount )
	SponWebsite(rowcount)=Request.Form(SponWebsitecount )
	SponZip(rowcount)=Request.Form(SponZipcount )
	Show(rowcount)=Request.Form(Showcount )


	rowcount = rowcount +1
Wend

 rowcount =1

while (rowcount < TotalCount + 1)

str1 = SponCompany(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	SponCompany(rowcount)= Replace(str1, "'", "''")
End If


str1 = SponOwner(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	SponOwner(rowcount)= Replace(str1, "'", "''")
End If


If Len(RanchID(rowcount))> 1 Then
Else
RanchID(rowcount) = 0
End If 
	Query =  " UPDATE Sponsors Set ID = " &  RanchID(rowcount) & ", " 
    'Query =  Query & "  SponsorLevel = '" & SponsorLevel (rowcount) & "'," 
	Query =  Query & "  SponCompany = '" & SponCompany(rowcount) & "'," 
    Query =  Query & "  SponOwner = '" & SponOwner(rowcount) & "'," 
    Query =  Query & "  SponAddress1 = '" & SponAddress1(rowcount) & "'," 
	Query =  Query & "  SponAddress2 = '" & SponAddress2(rowcount) & "'," 
	Query =  Query & "  Sponcity = '" & Sponcity(rowcount) & "'," 
	Query =  Query & "  SponState= '" & SponState(rowcount) & "'," 
	Query =  Query & "  SponCountry= '" & SponCountry(rowcount) & "'," 
	Query =  Query & "  SponPhone = '" & SponPhone(rowcount) & "'," 
	Query =  Query & "  SponEmail = '" & SponEmail(rowcount) & "'," 
	Query =  Query & "  SponWebsite = '" & SponWebsite(rowcount) & "'," 
	Query =  Query & "  SponZip = '" & SponZip(rowcount) & "'," 
	Query =  Query & "  Show = '" & Show(rowcount) & "'" 
	Query =  Query + " where SponID = " & SponID(rowcount) & ";" 


response.write(Query)	
Dim cmdDC, RecordSet
Dim RecordToEdit, Updated

Conn.Execute(Query) 

	  rowcount= rowcount +1
	Wend

     response.redirect("EditFiberManiaSponsors.asp")


%>
 </Body>
</HTML>
