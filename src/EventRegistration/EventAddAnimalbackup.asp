<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Event Home" 
PageLink = "EventRegister.asp" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<META name="keywords" content="Alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpaca Events" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

	
<!--#Include file="EventHeader.asp"-->
<% if Session("LoggedIn") = "True" and len(PeopleID) > 0 then %>


<% 
	
 sql = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID
' response.Write("sql=" & sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	
	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")
	EventTypeID = rs("EventTypeID")
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	MaxQTY3 =  rs("ServiceMaxQuantity3")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	VetCheckFee = rs("VetCheckFee")
	ElectricityFee = rs("ElectricityFee")
	ElectricityAvailable  = rs("ElectricityAvailable")

	Electricityoptional  = rs("Electricityoptional")

	MaxPensPerFarm = rs("MaxPensPerFarm")
	
	if MaxPensPerFarm > 0 then
	else
		MaxPensPerFarm = 40
	end if 

	MaxDisplaysPerFarm= rs("MaxDisplaysPerFarm")
	
	if MaxDisplaysPerFarm > 0 then
	else
		MaxDisplaysPerFarm = 40
	end if 
end if

 sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql3, conn, 3, 3   
while Not rs.eof 	
	if rs("ServiceType") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs("ServiceType") = "Fleece Show" then
       ShowFleeceShow = True 
     End If

     if rs("ServiceType") = "Vendors" then
       ShowVendors = True 
     End If


     	if rs("ServiceType") = "Stud Auction" then
       		ShowStudauction = True 
     	End If

	if rs("ServiceType") = "SpinOff" then
       		ShowSpinOff = True 
    End If

     if rs("ServiceType") = "Sponsor" then
       ShowSponsors = True
     End If
     
     if rs("ServiceType") = "Advertising" then
       ShowAdvertising = True
     End If


     if rs("ServiceType") = "Classes / Workshops" then
       ShowClasses = True 
     End If

     if rs("ServiceType") = "Dinner" then
       ShowDinner = True 
     End If
  
     if rs("ServiceType") = "Silent Auction" then
       ShowSilentAuction = True
     End If
rs.movenext
wend


	
AnimalID=request.querystring("AnimalID")
AnimalAdded=request.querystring("AnimalAdded")

AddAnimal=request.querystring("AddAnimal")

'response.write("AnimalAdded1111=" & AnimalAdded )

if AddAnimal="True" and AnimalAdded = "True" then
	AnimalRegistrationID = request.Form("AnimalRegistrationID")
	RegisteredAnimalID= request.Form("RegisteredAnimalID")
		RegisterWith = request.Form("RegisterWith")
		response.Write("RegisterWith=" & RegisterWith)
		If InStr(	RegisterWith,"Halter Show") > 0 Then
			response.Write("Found Halter Show")
			 Query =  " UPDATE RegisteredAnimals Set RegistrationType = 'Halter' " 
	         Query =  Query & " where RegisteredAnimalID = " & RegisteredAnimalID & ";" 
		End If 
		
		If InStr(	RegisterWith,"Companion Animal") > 0 Then
			response.Write("Companion Animal")
		End If 
	
		If InStr(	RegisterWith,"Production Class") > 0 Then
			response.Write("Production Class")
		End If 
		
		If InStr(	RegisterWith,"Fleece Show") > 0 Then
			response.Write("Fleece Show")
		End If 
		
		If InStr(	RegisterWith,"SpinOff") > 0 Then
			response.Write("SpinOff")
		End If 
	
	
	
	
   
		

DamID= request.Form("DamID")
SireID= request.Form("SireID")

'***************************************************
' gather Animal Information from Form
'***************************************************
AnimalID= request.querystring("AnimalID")
AnimalRegistrationID = request.form("AnimalRegistrationID")
DamID= request.form("DamID")
SireID= request.form("SireID")

BreedID = request.form("BreedID")
Category = request.form("Category")
DOBMonth = request.form("DOBMonth")
DOBDay = request.form("DOBDay")
DOBYear = request.form("DOBYear")
AnimalsColor = request.form("AnimalsColor")

AgeClass = request.form("AgeClass")
ThisSheardateMonth = request.form("ThisSheardateMonth")
ThisSheardateDay = request.form("ThisSheardateDay")
ThisSheardateYear = request.form("ThisSheardateYear")
SiresName = request.form("SiresName")
str1 = SiresName
str2 = "'"
If InStr(str1,str2) > 0 Then
	SiresName= Replace(str1,  str2, "''")
End If 


SiresRegNumber = request.form("SiresRegNumber")
str1 = SiresRegNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	SiresRegNumber= Replace(str1,  str2, "''")
End If 
SiresColor = request.form("SiresColor")



DamsName = request.form("DamsName")
str1 = DamsName
str2 = "'"
If InStr(str1,str2) > 0 Then
	DamsName= Replace(str1,  str2, "''")
End If 
DamsRegNumber = request.form("DamsRegNumber")
str1 = DamsRegNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	DamsRegNumber= Replace(str1,  str2, "''")
End If 

DamsColor = request.form("DamsColor")
Shearingmethod = request.form("Shearingmethod")
Handler = request.form("Handler")
str1 = Handler
str2 = "'"
If InStr(str1,str2) > 0 Then
	Handler= Replace(str1,  str2, "''")
End If

 
CoOwnerBusiness1 = request.form("CoOwnerBusiness1")
str1 = CoOwnerBusiness1
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerBusiness1= Replace(str1,  str2, "''")
End If 
'response.Write("CoOwnerBusiness1=" & CoOwnerBusiness1 )


CoOwnerName1 = request.form("CoOwnerName1")
str1 = CoOwnerName1
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerName1= Replace(str1,  str2, "''")
End If 
CoOwnerLink1 = request.form("CoOwnerLink1")
str1 = CoOwnerLink1
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerLink1= Replace(str1,  str2, "''")
End If
CoOwnerBusiness2 = request.form("CoOwnerBusiness2")
str1 = CoOwnerBusiness2
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerBusiness2= Replace(str1,  str2, "''")
End If
CoOwnerName2 = request.form("CoOwnerName2")
str1 = CoOwnerName2
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerName2= Replace(str1,  str2, "''")
End If

CoOwnerLink2 = request.form("CoOwnerLink2")
str1 = CoOwnerLink2
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerLink2= Replace(str1,  str2, "''")
End If

CoOwnerBusiness3 = request.form("CoOwnerBusiness3")
str1 = CoOwnerBusiness3
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerBusiness3= Replace(str1,  str2, "''")
End If

CoOwnerName3 = request.form("CoOwnerName3")
str1 = CoOwnerName3
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerName3= Replace(str1,  str2, "''")
End If

CoOwnerLink3 = request.form("CoOwnerLink3")
str1 = CoOwnerLink3
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerLink3= Replace(str1,  str2, "''")
End If
	
Name = request.form("Name")
str1 = Name
str2 = "'"
If InStr(str1,str2) > 0 Then
	Name= Replace(str1,  str2, "''")
End If

RegNumber = request.form("RegNumber")
str1 = RegNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	RegNumber= Replace(str1,  str2, "''")
End If



CurrentlyMicrochipped = request.form("CurrentlyMicrochipped")
MicrochipNumber = request.form("MicrochipNumber")
if len(MicrochipNumber) < 3 and CurrentlyMicrochipped = "No" then
  MicrochipNumber = "NA"

End if
str1 = MicrochipNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	MicrochipNumber= Replace(str1,  str2, "''")
End If 


'***************************************************
' If the Alpaca is NOT in The database, then add it
'***************************************************

MissingData = False	
'response.Write("AnimalsColor = " & AnimalsColor )
if len(Name) < 1 or len(BreedID)< 1 or len(Category)<1  or len(DOBMonth)<1 or len(DOBDay) < 1 or len(DOBYear)< 1 or len(AnimalsColor) < 1 or len(AgeClass) < 1  then
	MissingData = True
end if	
	'response.write("MissingData=" & MissingData )
if MissingData = False	then
	
	
	if len(AnimalRegistrationID) > 1 then
	Query =  " UPDATE AnimalRegistration Set "
	if len(RegNumber) > 0 then
	    Query =  Query & " RegNumber = '" & RegNumber & "'," 
	end if
	Query =  Query & " RegType = 'ARI' "
    Query =  Query & " where AnimalRegistrationID = " & AnimalRegistrationID & ";"  
	'response.write(Query)	
    Conn.Execute(Query)
    
    
    end if
    
    
if len(SiresName)> 0 or len(SiresRegistration)> 0 or len(SiresColor)> 0  then
	Query =  " UPDATE Sire Set "
	if len(SiresName)> 0 then
	    if len(SiresRegNumber)> 0 or len(SiresColor)> 0 then
            Query =  Query & " SiresName = '" & SiresName & "'," 
        else
            Query =  Query & " SiresName = '" & SiresName & "' " 
        end if
    end if
    if len(SiresRegNumber)> 0 then
        if len(SiresColor)> 0 then
	        Query =  Query & " SiresRegistration = '" & SiresRegNumber & "',"
	    else
		    Query =  Query & " SiresRegistration = '" & SiresRegNumber & "' "
	    end if
	end if
	if len(SiresColor)> 0 then
	Query =  Query & " SiresColor = '" & SiresColor & "' "
	
	end if
    Query =  Query & " where SireID = " & SireID & ";"  
	'response.write(Query)	
    Conn.Execute(Query)
end if


if len(DamsName)> 0 or len(DamsRegistration)> 0 or len(DamsColor)> 0  then
	Query =  " UPDATE Dam Set "
	if len(DamsName)> 0 then
	    if len(DamsRegNumber)> 0 or len(DamsColor)> 0 then
            Query =  Query & " DamsName = '" & DamsName & "'," 
        else
            Query =  Query & " DamsName = '" & DamsName & "' " 
        end if
    end if
    if len(DamsRegNumber)> 0 then
        if len(DamsColor)> 0 then
	        Query =  Query & " DamsRegistration = '" & DamsRegNumber & "',"
	    else
		    Query =  Query & " DamsRegistration = '" & DamsRegNumber & "' "
	    end if
	end if
	if len(DamsColor)> 0 then
	Query =  Query & " DamsColor = '" & DamsColor & "' "
	
	end if
    Query =  Query & " where DamID = " & DamID & ";"  
	'response.write(Query)	
    Conn.Execute(Query)
end if
    



	Query =  " UPDATE Animal Set "
    Query =  Query & " AnimalsName = '" & Name & "'," 
    Query =  Query & " MicrochipNumber = '" & MicrochipNumber & "'," 
  
    Query =  Query & " Category = '" & Category & "'," 
    if len(DOBMonth ) > 0 then	
		Query =  Query & " DOBMonth = '" & DOBMonth & "'," 
	end if
	if len(DOBDay ) > 0 then	
		Query =  Query & " DOBDay = '" & DOBDay & "'," 
	end if
	if len(DOBYear ) > 0 then	
		Query =  Query & " DOBYear = '" & DOBYear & "'," 
	end if
	
	
	if len(AnimalRegistrationID ) > 0 then
		Query =  Query & " AnimalRegistrationID = '" & AnimalRegistrationID & "'," 
    end if 
    if len(ThisShearingMonth ) > 0 then	
		Query =  Query & " ThisSheardateMonth = '" & ThisSheardateMonth & "'," 
	end if
	if len(ThisSheardateDay ) > 0 then	
		Query =  Query & " ThisSheardateDay = '" & ThisSheardateDay & "'," 
	end if
	if len(ThisSheardateYear) > 0 then	
		Query =  Query & " ThisSheardateYear = '" & ThisSheardateYear & "'," 
	end if
	if len(Shearingmethod ) > 0 then	
    Query =  Query & " Shearingmethod = '" & Shearingmethod & "'," 
    end if
    Query =  Query & " Color = '" & AnimalsColor & "',"
	Query =  Query & " Handler = '" & Handler & "',"
	Query =  Query & " AgeClass = '" & AgeClass & "', "
	Query =  Query & " CoOwnerName1 = '" & CoOwnerName1 & "', "
	Query =  Query & " CoOwnerLink1 = '" & CoOwnerLink1 & "', "
	Query =  Query & " CoOwnerBusiness1 = '" & CoOwnerBusiness1 & "', "
	Query =  Query & " CoOwnerName2 = '" & CoOwnerName2 & "', "
	Query =  Query & " CoOwnerLink2 = '" & CoOwnerLink2 & "', "
	Query =  Query & " CoOwnerBusiness2 = '" & CoOwnerBusiness2 & "', "
	Query =  Query & " CoOwnerName3 = '" & CoOwnerName3 & "', "
	Query =  Query & " CoOwnerLink3 = '" & CoOwnerLink3 & "', "
	Query =  Query & " CoOwnerBusiness3 = '" & CoOwnerBusiness3 & "' "	
    Query =  Query & " where AnimalID = " & AnimalID & ";"  
	'response.write(Query)	
    Conn.Execute(Query)
    
 
end if
end if


response.write("AnimalAdded222222=" & AnimalAdded )



if AddAnimal="True" and not(AnimalAdded = "True") then
  '***************************************************
' gather Animal Information from Form
'***************************************************
 ' Start add animal to classes etc.		
 
	' End Update Production Classes
BreedID = request.form("BreedID")
Category = request.form("Category")
DOBMonth = request.form("DOBMonth")
DOBDay = request.form("DOBDay")
DOBYear = request.form("DOBYear")
AnimalsColor = request.form("AnimalsColor")

AgeClass = request.form("AgeClass")
ThisSheardateMonth = request.form("ThisSheardateMonth")
ThisSheardateDay = request.form("ThisSheardateDay")
ThisSheardateYear = request.form("ThisSheardateYear")
SiresName = request.form("SiresName")
str1 = SiresName
str2 = "'"
If InStr(str1,str2) > 0 Then
	SiresName= Replace(str1,  str2, "''")
End If 


SiresRegNumber = request.form("SiresRegNumber")
str1 = SiresRegNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	SiresRegNumber= Replace(str1,  str2, "''")
End If 
SiresColor = request.form("SiresColor")



DamsName = request.form("DamsName")
str1 = DamsName
str2 = "'"
If InStr(str1,str2) > 0 Then
	DamsName= Replace(str1,  str2, "''")
End If 
DamsRegNumber = request.form("DamsRegNumber")
str1 = DamsRegNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	DamsRegNumber= Replace(str1,  str2, "''")
End If 

DamsColor = request.form("DamsColor")
Shearingmethod = request.form("Shearingmethod")
Handler = request.form("Handler")
str1 = Handler
str2 = "'"
If InStr(str1,str2) > 0 Then
	Handler= Replace(str1,  str2, "''")
End If

 
CoOwnerBusiness1 = request.form("CoOwnerBusiness1")
str1 = CoOwnerBusiness1
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerBusiness1= Replace(str1,  str2, "''")
End If 
'response.Write("CoOwnerBusiness1=" & CoOwnerBusiness1 )


CoOwnerName1 = request.form("CoOwnerName1")
str1 = CoOwnerName1
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerName1= Replace(str1,  str2, "''")
End If 
CoOwnerLink1 = request.form("CoOwnerLink1")
str1 = CoOwnerLink1
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerLink1= Replace(str1,  str2, "''")
End If
CoOwnerBusiness2 = request.form("CoOwnerBusiness2")
str1 = CoOwnerBusiness2
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerBusiness2= Replace(str1,  str2, "''")
End If
CoOwnerName2 = request.form("CoOwnerName2")
str1 = CoOwnerName2
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerName2= Replace(str1,  str2, "''")
End If

CoOwnerLink2 = request.form("CoOwnerLink2")
str1 = CoOwnerLink2
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerLink2= Replace(str1,  str2, "''")
End If

CoOwnerBusiness3 = request.form("CoOwnerBusiness3")
str1 = CoOwnerBusiness3
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerBusiness3= Replace(str1,  str2, "''")
End If

CoOwnerName3 = request.form("CoOwnerName3")
str1 = CoOwnerName3
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerName3= Replace(str1,  str2, "''")
End If

CoOwnerLink3 = request.form("CoOwnerLink3")
str1 = CoOwnerLink3
str2 = "'"
If InStr(str1,str2) > 0 Then
	CoOwnerLink3= Replace(str1,  str2, "''")
End If
	
Name = request.form("Name")
str1 = Name
str2 = "'"
If InStr(str1,str2) > 0 Then
	Name= Replace(str1,  str2, "''")
End If

RegNumber = request.form("RegNumber")
str1 = RegNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	RegNumber= Replace(str1,  str2, "''")
End If
'response.Write("RegNumber=" & RegNumber )


CurrentlyMicrochipped = request.form("CurrentlyMicrochipped")
MicrochipNumber = request.form("MicrochipNumber")
if len(MicrochipNumber) < 3 and CurrentlyMicrochipped = "No" then
  MicrochipNumber = "NA"

End if
str1 = MicrochipNumber
str2 = "'"
If InStr(str1,str2) > 0 Then
	MicrochipNumber= Replace(str1,  str2, "''")
End If 


'***************************************************
' Check to See if the Alpaca is The database
'***************************************************
InDatabase  = False


sql3 = "select * from Animal where AnimalsName = '" & Name & "' and PeopleID = " & PeopleID
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if rs3.eof then 
  InDatabase  = False
else
  InDatabase  = True
end if


'***************************************************
' If the Alpaca is NOT in The database, then add it
'***************************************************
	If InDatabase  = False then 
	

MissingData = False	
'response.write("AnimalsColor = " & AnimalsColor )
if len(Name) < 1 or len(BreedID)< 1 or len(Category)<1  or len(DOBMonth)<1 or len(DOBDay) < 1 or len(DOBYear)< 1 or len(AnimalsColor) < 1 or len(AgeClass) < 1  then
	MissingData = True
end if	
	'response.write("MissingData=" & MissingData )
if MissingData = False	then
	
Query =  "INSERT INTO AnimalRegistration ( RegType "
if len(RegNumber) > 0 then
    Query =  Query & ", RegNumber"
end if 
    Query =  Query & ")"
if len(RegNumber) > 0 then
    Query =  Query & " Values ('ARI'," 
    Query =  Query & " '" &  RegNumber & "')"
else
  Query =  Query & " Values ('ARI')"
end if 
'response.write("Query=" & Query )	
Conn.Execute(Query) 

	
sql3 = "select AnimalRegistrationID from AnimalRegistration where RegType = 'ARI' "
if len(RegNumber)> 1 then
    sql3 = sql3 & "and RegNumber = '" & RegNumber & "'"
end if
    sql3 = sql3 & " order by AnimalRegistrationID DESC" 

'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  AnimalRegistrationID = rs3("AnimalRegistrationID")
end if
rs3.close

		
Query =  "INSERT INTO Sire ( SiresName, SiresRegistration, SiresColor )" 
Query =  Query & " Values ('" & SiresName & "'," 
Query =  Query & " '" & SiresRegNumber  & "' ," 
Query =  Query & " '" &  SiresColor & "')"
'response.write("Query=" & Query )	
Conn.Execute(Query) 

	
sql3 = "select SireID from Sire where SiresRegistration = '" & SiresRegNumber & "' and SiresName = '" & SiresName & "' and SiresColor = '" & SiresColor & "'" 
''response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  SireID = rs3("SireID")
end if
rs3.close


		
Query =  "INSERT INTO Dam ( DamsName, DamsRegistration, DamsColor )" 
Query =  Query & " Values ('" & DamsName & "'," 
Query =  Query & " '" & DamsRegNumber  & "' ," 
Query =  Query & " '" &  DamsColor & "')"
'response.write("Query=" & Query )	
Conn.Execute(Query) 

	
sql3 = "select DamID from Dam where DamsRegistration = '" & DamsRegNumber & "' and DamsName = '" & DamsName & "' and DamsColor = '" & DamsColor & "'" 
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  DamID = rs3("DamID")
end if
rs3.close


Query =  "INSERT INTO Animal ( PeopleID, SpeciesID, "
if len(AnimalRegistrationID ) > 1 then
		Query =  Query & " AnimalRegistrationID," 
end if 
 
Query =  Query & "BreedID, AnimalsName, SireID, DamID,   MicrochipNumber,  DOBMonth, DOBDay, DOBYear, Color, Category, "
if len(ThisShearingMonth ) > 1 then	
		Query =  Query & " ThisShearingMonth,"
	end if
	if len(ThisSheardateDay ) > 1 then	
		Query =  Query & " ThisSheardateDay ,"
	end if
	if len(ThisSheardateYear ) > 1 then	
		Query =  Query & " ThisSheardateYear ,"
	end if	
		Query =  Query & " Shearingmethod, Handler, AgeClass, CoOwnerName1, CoOwnerLink1, CoOwnerBusiness1, CoOwnerName2, CoOwnerLink2, CoOwnerBusiness2, CoOwnerName3, CoOwnerLink3, CoOwnerBusiness3   )" 
		Query =  Query & " Values (" &  session("PeopleID") & "," 
		Query =  Query & " 1 ," 
	if len(AnimalRegistrationID ) > 1 then
		Query =  Query & " " & AnimalRegistrationID  & " ," 
	end if
		Query =  Query & " "  &  BreedID & "," 
		Query =  Query & " '"  & Name  & "'," 	
		Query =  Query & " "  &  SireID & ","
		Query =  Query & " "  &  DamID & ","
		Query =  Query & " '"  & MicrochipNumber & "',"
		Query =  Query & " "  & DOBMonth  & ","
		Query =  Query & " "  & DOBDay  & ","
		Query =  Query & " "  & DOBYear  & ","
		Query =  Query & " '"  & AnimalsColor  & "',"
		Query =  Query & " '"  & Category  & "',"
		
	if len(ThisShearingMonth ) > 1 then	
		Query =  Query & " "  & ThisShearingMonth  & ","
	end if
	if len(ThisSheardateDay ) > 1 then	
		Query =  Query & " "  & ThisSheardateDay  & ","
	end if
	if len(ThisSheardateYear ) > 1 then	
		Query =  Query & " "  & ThisSheardateYear  & ","
	end if	
		Query =  Query & " '"  & Shearingmethod   & "',"
		Query =  Query & " '"  & Handler & "',"
		Query =  Query & " '"  & AgeClass & "',"
		Query =  Query & " '"  & CoOwnerName1 & "',"
		Query =  Query & " '"  & CoOwnerLink1 & "',"
		Query =  Query & " '"  & CoOwnerBusiness1  & "',"
		Query =  Query & " '"  & CoOwnerName2 & "',"
		Query =  Query & " '"  & CoOwnerLink2 & "',"
		Query =  Query & " '"  & CoOwnerBusiness2  & "',"
		Query =  Query & " '"  & CoOwnerName3 & "',"
		Query =  Query & " '"  & CoOwnerLink3 & "',"
		Query =  Query & " '"  & CoOwnerBusiness3  & "')"
		
'response.write("<br>insert Query = " & Query & "<br>")
		Conn.Execute(Query) 
 AnimalAdded = True
 'response.Write("AnimalAdded3333=" & AnimalAdded )
 Conn.close
 set Conn = Nothing
 
 Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=admin;PWD=Chickens"
Set rs = Server.CreateObject("ADODB.Recordset")
 
sql3 = "select AnimalID from Animal where AnimalsName = '" & Name & "' and PeopleID = " & PeopleID & " and AnimalRegistrationID = " & AnimalRegistrationID 
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  AnimalID  = rs3("AnimalID")
  'response.write("animalID=" & animalID )
end if
 
 
 sql3 = "select RegistratedAnimalID from RegisteredAnimals where  PeopleID = " & PeopleID & " and AnimalRegistrationID = " & AnimalRegistrationID
response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  RegistratedAnimalID  = rs3("RegistratedAnimalID")
  response.write("RegistratedAnimalID=" & RegistratedAnimalID )
end if


end if
	end if
end if





'response.write("AnimalAdded44444=" & AnimalAdded )




sql3 = "select * from Event where EventID = " & EventID
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  AOBA = rs3("AOBA")
end if



'***************************************************
' gather Animal Information from Form
'***************************************************

BreedID = request.form("BreedID")
Category = request.form("Category")
DOBMonth = request.form("DOBMonth")
DOBDay = request.form("DOBDay")
DOBYear = request.form("DOBYear")
AnimalsColor = request.form("AnimalsColor")
AgeClass = request.form("AgeClass")
ThisSheardateMonth = request.form("ThisSheardateMonth")
ThisSheardateDay = request.form("ThisSheardateDay")
ThisSheardateYear = request.form("ThisSheardateYear")
SiresName = request.form("SiresName")
SiresRegNumber = request.form("SiresRegNumber")
DamsName = request.form("DamsName")
DamsRegNumber = request.form("DamsRegNumber")
DamsColor = request.form("DamsColor")
Shearingmethod = request.form("Shearingmethod")
Handler = request.form("Handler")
CoOwnerBusiness1 = request.form("CoOwnerBusiness1")
CoOwnerName1 = request.form("CoOwnerName1")
CoOwnerLink1 = request.form("CoOwnerLink1")
CoOwnerBusiness2 = request.form("CoOwnerBusiness2")
CoOwnerName2 = request.form("CoOwnerName2")
CoOwnerLink2 = request.form("CoOwnerLink2")
CoOwnerBusiness3 = request.form("CoOwnerBusiness3")
CoOwnerName3 = request.form("CoOwnerName3")
CurrentlyMicrochipped = request.form("CurrentlyMicrochipped")
MicrochipNumber = request.form("MicrochipNumber")
if len(MicrochipNumber) < 3 and CurrentlyMicrochipped = "No" then
  MicrochipNumber = "NA"
End if




%>


<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr><td class = "body" colspan = "2" ><br><h1>Register Your Animals</h1>

<input type = "text" name="RegisteredAnimalID" value="<%=RegisteredAnimalID%>" >
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
  <tr>
  <td class = "body" align = "center"><br /><a href = "EventRegister.asp?EventID=12&PeopleID=1#Halter" class = "body"><b>Go To Registration Page</b></a>
  
  </td>
  </tr>
</table>

<% 'response.Write("AnimalAddedxxx=" & AnimalAdded )
show = false
if show = true then %>
<form action= "EventAddAnimal.asp?EventID=<%=EventID%>&AddAnimal=True?AnimalAdded=<%=AnimalAdded%>" name="OrderForm" method = "post">

<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "700" align = "center">	
<tr>
  <td class = "body" align = "center" background = "images/Registrationheader.jpg" height = "39"><h2>Registered Animal</h2>

</td>
</tr>
<tr>
  <td background = "images/Registrationbackground.jpg">
  	<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "690" align = "center">
	
	<% sql3 = "select * from Animal where EventID = " & EventID 
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof 
  
 %>

	<tr>
		<td height = "30" class = "body" align = "right"> </td>
		<td width = "5"><img src = "images/px.gif" width = "1" height = "1"></td>
		<td></td>
	</tr>

<% rs3.movenext
wend
rs3.close %>
</table>
</td>
</tr>
<tr>
  <td background = "images/RegistrationFooter.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>

</form>
<% end if %>





<form action= "EventAddAnimal.asp?EventID=<%=EventID%>&AddAnimal=True&AnimalAdded=<%=AnimalAdded%>&AnimalID=<%=AnimalID%>" name="OrderForm" method = "post">

<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "700" align = "center">	
<tr>
  <td class = "body" align = "center" background = "images/Registrationheader.jpg" height = "39"><h2>Add an Animal</h2>

</td>
</tr>
<tr>
  <td background = "images/Registrationbackground.jpg">
  	<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "690" align = "center">
	<tr>
		<td height = "30" class = "body" align = "right">
			</td>
		<td width = "5"><img src = "images/px.gif" width = "1" height = "1"></td>
		<td>* required fields
		</td>
	</tr>

	<% 
	if MissingData = True then %>
<tr>
	<td height = "30" class = "body" colspan = "3">
	<font color = "brown">
	<h3>Missing Information</h3>
	Your animal was not added. Please enter the following:
	<ul>
	<% if len(Name) < 1 then %>
		<li>Animals' Name</li>
	<% end if %>
	<% if len(BreedID) < 1 then %>
		<li>Breed</li>
	<% end if %>
	<% if len(Category) < 1 then %>
		<li>Gender Category</li>
	<% end if %>
	<% if len(DOBMonth) < 1 or len(DOBDay) < 1  or len(DOBYear) < 1 then %>
		<li>Complete DOB</li>
	<% end if %>
	<% if len(AnimalsColor) < 1 then %>
		<li>Color</li>
	<% end if %>
	<% if len(AgeClass) < 1 then %>
		<li>Age Class</li>
	<% end if %>
	</uL></font>
 
	</td>
	</tr>
<% end if %>
	
	 <tr>
		<td width = "400" height = "30" class = "body" align = "right">
		<% if MissingData = True and len(Name) < 1 then %>
		<font color = "brown">
		<% end if %>
		Full Registered Alpaca Name:*	<% if MissingData = True and len(Name) < 1 then %>
		</font>
		<% end if %>
<br>
			<i>As shown on registration</i>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="Name" value="<%=Name%>" size = "40">
				</td>
			</tr>
			<tr>
			    <td  class = "body" align = "right" valign = "top">Include This Animal in the following:</td>
			   <td width = "5"><img src = "images/px.gif" width = "1"></td>
			    <td class = "body">
			      <% if ShowHalterShow = True  then %>
			           <input type="checkbox" name="RegisterWith" value="Halter Show" >Halter Show<br >
			            <input type="checkbox" name="RegisterWith" value="Companion Animal" >Companion Animal<br >
			      		<% if len(Price4) > 0  then %>
			              <input type="checkbox" name="RegisterWith" value="Production Class" >Production Class<br >
			            <% end if  %>
                    <%    End If
 
             if  ShowFleeceShow = True  then %>
			        <input type="checkbox" name="RegisterWith" value="Fleece Show" >Fleece Show<br >
            <% End If

	        if ShowSpinOff = True  then %>
			        <input type="checkbox" name="RegisterWith" value="SpinOff" >SpinOff<br >
          <% End If  %> 

			    </td>
			</tr>
			<tr>
				<td class = "body" height = "30" align = "right" >
					ARI#:
				</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="RegNumber" value="<%=RegNumber%>" size = "20">
				</td>
			</tr>
		<tr>
				<td class = "body" height = "30" align = "right" >
					<% if MissingData = True and len(MicrochipNumber) < 1 then %>
				<font color = "brown">
				<% end if %>
					Is the animal currently microchipped?:<% if MissingData = True and len(MicrochipNumber) < 1 then %>
				</font >
				<% end if %>

				</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td class = "body">
				
				<% if CurrentlyMicrochipped = "No" then %>
					Yes<input TYPE="RADIO" name="CurrentlyMicrochipped" Value = "Yes" >
					No<input TYPE="RADIO" name="CurrentlyMicrochipped" Value = "No" checked>
				<% else %>
					Yes<input TYPE="RADIO" name="CurrentlyMicrochipped" Value = "Yes" checked>
					No<input TYPE="RADIO" name="CurrentlyMicrochipped" Value = "No" >
				<% end if %>

				
				</td>
			</tr>

	<tr>
				<td class = "body" height = "30" align = "right" >
					<% if MissingData = True and len(MicrochipNumber) < 1 then %>
				<font color = "brown">
				<% end if %>
				Microchip#:
				<% if MissingData = True and len(MicrochipNumber) < 1 then %>
				</font>
				<% end if %>

				</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="MicrochipNumber" value="<%=MicrochipNumber %>" size = "20">
				</td>
			</tr>
		<tr>
	  	<td class = "body" height = "30" align = "right">
			<% if MissingData = True and len(Breed) < 1 then %>
				<font color = "brown">
				<% end if %>
				Breed*:
				<% if MissingData = True and len(Breed) < 1 then %>
				</font>
				<% end if %>

		</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>

			<td>
			<select size="1" name="BreedID">
			  <% if len(BreedID) < 1 then %>
					<option name = "Breed2" value= "" selected></option>
			 <% else 
			 	if BreedID = 1 then
			 	   BreedName = "Huacaya"
			 	else
			 	 BreedName = "Suri"
				end if 
			 %>
			 		<option name = "Breed2" value= "<%=BreedID%>" selected><%=BreedName%></option>
			 <% end if %>
					<option name = "Breed3" value="1">Huacaya</option>
					<option name = "Breed1" value="2">Suri</option>
					</select>
			</td>
		</tr>
				<tr>
	  	<td class = "body" height = "30" align = "right">
			<% if MissingData = True and len(Category) < 1 then %>
				<font color = "brown">
				<% end if %>
					Gender Category*:
					<% if MissingData = True and len(Category) < 1 then %>
				</font>
				<% end if %>

		</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>

			<td>
					<select size="1" name="Category">
				<% if len(Category) < 1 then %>
					<option name = "Category2" value= "" selected></option>
				<% else  %>
					<option name = "Category2" value= "<%=Category %>" selected><%=Category %></option>
				<% end if %>
					<option name = "Category12" value="Experienced Male">Experienced Male <small>(gotten at least one Dam pregnant)</small></option>
					<option name = "Category12" value="Inexperienced Male">Inexperienced Male <small>(never gotten a Dam pregnant)</small></option>
				     <option name = "Category14" value="Experienced Female">Experienced Female <small>(has been pregnant at least once.)</small></option>
					 <option name = "Category13" value="Inexperienced Female">Inexperienced Female <small>(has never been pregnant)</small></option>
				     <option name = "Category15" value="Gelded Male">Gelded Male</option>
					</select>
			</td>
		</tr>
		<tr>
		<td class = "body" height = "30" align = "right">
			<% if MissingData = True and ( len(DOBMonth) < 1 or len(DOBDay) < 1  or len(DOBYear) < 1 ) then %>
				<font color = "brown">
				<% end if %>
			Date of Birth*:
			<% if MissingData = True and ( len(DOBMonth) < 1 or len(DOBDay) < 1  or len(DOBYear) < 1 ) then %>
				</font>
				<% end if %>

		</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td>
				<select size="1" name="DOBMonth">
				<% if len(DOBMonth) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=DOBMonth%>" selected><%=DOBMonth%></option>
				<% end if %>
					
					<option value="1">Jan. (1)</option>
					<option  value="2">Feb. (2)</option>
					<option  value="3">March (3)</option>
					<option  value="4">April (4)</option>
					<option  value="5">May (5)</option>
					<option  value="6">June (6)</option>
					<option  value="7">July (7)</option>
					<option  value="8">Aug. (8)</option>
					<option  value="9">Sept. (9)</option>
					<option  value="10">Oct. (10)</option>
					<option  value="11">Nov. (11)</option>
					<option  value="12">Dec. (12)</option>
				</select>
				<select size="1" name="DOBDay">
					<% if len(DOBDay) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=DOBDay%>" selected><%=DOBDay%></option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>
		<select size="1" name="DOBYear">
				<% if len(DOBYear) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=DOBYear%>" selected><%=DOBYear%></option>
				<% end if %>

			
			<% currentyear = year(date) 
						'response.write(currentyear)
					For yearv=1983 To currentyear %>
				

					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>	
     <tr>
			<td class = "body" height = "30" align = "right">
			<% if MissingData = True and len(Color) < 1 then %>
		<font color = "brown">
		<% end if %>
		Color*:
		<% if MissingData = True and len(Color) < 1 then %>
		</font>
		<% end if %>

		</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td>
			<select size="1" name="AnimalsColor">
				<% if len(AnimalsColor) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=AnimalsColor%>" selected><%=AnimalsColor%></option>
				<% end if %>
					<option value="White">White</option>
					<option value="Beige">Beige</option>
					<option value="Light Fawn">Light Fawn</option>
					<option value="Medium Fawn">Medium Fawn</option>
					<option value="Dark Fawn">Dark Fawn</option>
					<option value="Light Brown">Light Brown</option>
					<option value="Medium Brown">Medium Brown</option>
					<option value="Dark Brown">Dark Brown</option>
					<option value="Light Silver Grey">Light Silver Grey</option>
					<option value="Medium Silver Grey">Medium Silver Grey</option>
					<option value="Dark Silver Grey">Dark Silver Grey</option>
					<option value="Light Rose Grey">Light Rose Grey</option>
					<option value="Medium Rose Grey">Medium Rose Grey</option>
					<option value="Dark Rose Grey">Dark Rose Grey</option>
					<option value="Bay Black">Bay Black</option>
					<option value="True Black">True Black</option>
					<option value="Pattern">Pattern</option>
					<option value="Pinto">Pinto</option>
					<option value="Fancy">Fancy</option>
					<option value="Appaloosa">Appaloosa</option>
					<option value="Indefinite Light">Indefinite Light</option>
					<option value="Indefinite Dark">Indefinite Dark</option>
					</select>
		
	
</td>
</tr>
 <tr>
			<td class = "body" height = "30" align = "right">
			<% if MissingData = True and len(AgeClass) < 1 then %>
		<font color = "brown">
		<% end if %>
		Age Class*:
		<% if MissingData = True and len(AgeClass) < 1 then %>
		</font >
		<% end if %>

		</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td>
			<select size="1" name="AgeClass">
				<% if len(AgeClass) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=AgeClass%>" selected><%=AgeClass%></option>
				<% end if %>

					<option value="A">A - 6 - 12 Months (juvenile)</option>
					<option value="B">B - 1st Birthday - 24 months (yearling)</option>
					<option value="C">C - 2nd Birthday - 36 months (young adult)</option>
					<option value="D">D - 3rd Birthday - 60 months (adult)</option>
					<option value="E">E - 5th Birthday and older (mature)</option>
			</select>
		
	
</td>
</tr>
<tr>
		<td class = "body" height = "30" align = "right">
			Date Shorn:
		</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td>
				<select size="1" name="ThisShearingMonth">
				<% if len(ThisShearingMonth) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=ThisShearingMonth%>" selected><%=ThisShearingMonth%></option>
				<% end if %>

					<option value="1">Jan. (1)</option>
					<option  value="2">Feb. (2)</option>
					<option  value="3">March (3)</option>
					<option  value="4">April (4)</option>
					<option  value="5">May (5)</option>
					<option  value="6">June (6)</option>
					<option  value="7">July (7)</option>
					<option  value="8">Aug. (8)</option>
					<option  value="9">Sept. (9)</option>
					<option  value="10">Oct. (10)</option>
					<option  value="11">Nov. (11)</option>
					<option  value="12">Dec. (12)</option>
				</select>
				<select size="1" name="ThisSheardateDay">
				<% if len(ThisSheardateDay) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=ThisSheardateDay%>" selected><%=ThisSheardateDay%></option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>
		<select size="1" name="ThisSheardateYear">
				<% if len(ThisSheardateYear) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=ThisSheardateYear%>" selected><%=ThisSheardateYear%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						'response.write(currentyear)
					For yearv=1983 To currentyear %>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
		<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Sire's Name:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="SiresName" value="<%=SiresName %>"  size = "40">
				</td>

			</tr>
	<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Sire's ARI#:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="SiresRegNumber" value="<%=SiresRegNumber%>" size = "40">
				</td>

			</tr>
	<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Sire's Color:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<select size="1" name="SiresColor">
					<% if len(SiresColor) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=SiresColor%>" selected><%=SiresColor%></option>
				<% end if %>

					<option value="White">White</option>
					<option value="Beige">Beige</option>
					<option value="Light Fawn">Light Fawn</option>
					<option value="Medium Fawn">Medium Fawn</option>
					<option value="Dark Fawn">Dark Fawn</option>
					<option value="Light Brown">Light Brown</option>
					<option value="Medium Brown">Medium Brown</option>
					<option value="Dark Brown">Dark Brown</option>
					<option value="Light Silver Grey">Light Silver Grey</option>
					<option value="Medium Silver Grey">Medium Silver Grey</option>
					<option value="Dark Silver Grey">Dark Silver Grey</option>
					<option value="Light Rose Grey">Light Rose Grey</option>
					<option value="Medium Rose Grey">Medium Rose Grey</option>
					<option value="Dark Rose Grey">Dark Rose Grey</option>
					<option value="Bay Black">Bay Black</option>
					<option value="True Black">True Black</option>
					<option value="Pattern">Pattern</option>
					<option value="Pinto">Pinto</option>
					<option value="Fancy">Fancy</option>
					<option value="Appaloosa">Appaloosa</option>
					<option value="Indefinite Light">Indefinite Light</option>
					<option value="Indefinite Dark">Indefinite Dark</option>
					</select>
				</td>

			</tr>

<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Dam's Name:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="DamsName" value="<%=DamsName %>" size = "40">
				</td>

			</tr>
	<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Dam's ARI#:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="DamsRegNumber" value="<%=DamsRegNumber %>" size = "40">
				</td>

			</tr>
	<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Dam's Color:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<select size="1" name="DamsColor">
				<% if len(DamsColor) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=DamsColor%>" selected><%=DamsColor%></option>
				<% end if %>

					<option value="White">White</option>
					<option value="Beige">Beige</option>
					<option value="Light Fawn">Light Fawn</option>
					<option value="Medium Fawn">Medium Fawn</option>
					<option value="Dark Fawn">Dark Fawn</option>
					<option value="Light Brown">Light Brown</option>
					<option value="Medium Brown">Medium Brown</option>
					<option value="Dark Brown">Dark Brown</option>
					<option value="Light Silver Grey">Light Silver Grey</option>
					<option value="Medium Silver Grey">Medium Silver Grey</option>
					<option value="Dark Silver Grey">Dark Silver Grey</option>
					<option value="Light Rose Grey">Light Rose Grey</option>
					<option value="Medium Rose Grey">Medium Rose Grey</option>
					<option value="Dark Rose Grey">Dark Rose Grey</option>
					<option value="Bay Black">Bay Black</option>
					<option value="True Black">True Black</option>
					<option value="Pattern">Pattern</option>
					<option value="Pinto">Pinto</option>
					<option value="Fancy">Fancy</option>
					<option value="Appaloosa">Appaloosa</option>
					<option value="Indefinite Light">Indefinite Light</option>
					<option value="Indefinite Dark">Indefinite Dark</option>
					</select>
				</td>

			</tr>
		<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Shearing Method:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<select size="1" name="Shearingmethod">
				<% if len(Shearingmethod) < 1 then %>
					<option value="" selected></option>
				<% else %>
					<option value="<%=Shearingmethod%>" selected><%=Shearingmethod%></option>
				<% end if %>

					<option value="Electric Shears">Electric Shears</option>
					<option value="Hand Shears">Hand Shears</option>
					</select>
				</td>
			</tr>
<tr>
		<td width = "300" height = "30" class = "body" align = "right">
			Handler:<br>
		</td>
				<td width = "5"><img src = "images/px.gif" width = "1"></td>
				<td>
					<input name="Handler" value="<%=Handler%>" size = "40">

				</td>
			</tr>
			
			
	<Tr>
	  <td colspan = "3" class = "body"><blockquote><b>Co-Owners</b><br>
	  If the alpaca is co-owned and you want the others names to appear in the show records then please enter them below. <% if AOBA = True then %>
	  Note however that an exhibitor disclosure form will need to be submitted for each listed owner.<br><br></blockquote>
	  <% end if %>
	  
	  
	  
	  </td>
	</tr>	
	<tr>
		<td  align = "right" class = "body" >1st Co-owner's Ranch Name:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>

		<td  valign = "bottom"  class = "body"> <input type=text name='CoOwnerBusiness1' value='<%=CoOwnerBusiness1%>' size=20 > </td>
	</tr>
	<tr>
		<td  align = "right" class = "body" >1st Co-owner's Name:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body"> <input type=text name='CoOwnerName1' value='<%=CoOwnerName1%>' size=20 > </td>
	</tr>

	<tr>
		<td  align = "right" class = "body" >1st Co-owner link:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body">http://<input type=text name='CoOwnerLink1' value='<%=CoOwnerLink1%>' size=20>  </td>
	</tr>
<tr>
		<td  align = "right" class = "body" >2nd Co-owner's Ranch Name:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body"> <input type=text name='CoOwnerBusiness2' value='<%=CoOwnerBusiness2%>' size=20 > </td>
	</tr>
	<tr>
		<td  align = "right" class = "body" >2nd Co-owner's Name:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body"> <input type=text name='CoOwnerName2' value='<%=CoOwnerName2%>'  size=20 > </td>
	</tr>

	<tr>
		<td  align = "right" class = "body" >2nd Co-owner link:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body">http://<input type=text name='CoOwnerLink2' value='<%=CoOwnerLink2%>' size=20>  </td>
	</tr>
<tr>
		<td  align = "right" class = "body" >3rd Co-owner's Ranch Name:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body"> <input type=text name='CoOwnerBusiness3' value='<%=CoOwnerBusiness3%>' size=20 > </td>
	</tr>
	<tr>
		<td  align = "right" class = "body" >3rd Co-owner's Name:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body"> <input type=text name='CoOwnerName3' value='<%=CoOwnerName3%>' size=20 > </td>
	</tr>

	<tr>
		<td  align = "right" class = "body" >3rd Co-owner link:&nbsp;</td>
		<td width = "5"><img src = "images/px.gif" width = "1"></td>
		<td  valign = "bottom"  class = "body">http://<input type=text name='CoOwnerLink3'  value='<%=CoOwnerLink3%>' size=20>  </td>
	</tr>
	<tr>
		<td  colspan = "3" height = "50" valign = "top" align = "center"><br><br>
		<input type=hidden name="AnimalRegistrationID" value="<%=AnimalRegistrationID%>"  >
		<input type=hidden name="DamID" value="<%=DamID%>"  >
		<input type=hidden name="SireID" value="<%=SireID%>"  >
		
		<% 
	
		if AnimalAdded = True or AnimalAdded = "True" then %>
			<input type="submit"  value="Edit Animal" class = "Regsubmit2" >
			</form>
			<form action= "EventAddAnimal.asp?EventID=<%=EventID%>&AddAnimal=True?" name="OrderForm" method = "post">
		<input type="submit"  value="Add Another Animal" class = "Regsubmit2" >
		</form>
		<% else %>
		<input type="submit"  value="Add Animal" class = "Regsubmit2" >
		</form>
		<% end if %><br></td>
	</tr>

</table>
</td>
</tr>
<tr>
  <td background = "images/RegistrationFooter.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>



<% end if ' REGISTRATION IS OPEN %>
<% if Session("LoggedIn") = "True" and len(PeopleID) > 0 then %>

<% else %>
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr><td class = "body" colspan = "2" ><br>
<h2>Please Sign Back In</h2>
You have been away from our website for two long. Please <a href = "regcreateSignIn.asp?Action=Register&ReturnFileName=<%=FileName%>&ReturnEventID=<%=EventID%>" class = "body">click here to log back in.</a>

</td></tr>
</table>
<% end if %>



 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</BODY>
</html>

