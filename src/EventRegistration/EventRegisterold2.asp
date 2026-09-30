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



	
<%
dim ClassesQTYArray(1000)
dim SponsorQTYArray(1000)
dim AdvertsingQTYArray(1000)
dim VendorQTYArray(1000)
dim VendorTableQTYArray(1000)
dim ExtraOptionsQTYArray(1000)


OrderTotal = 0

EventSubTypeID = request.querystring("EventSubTypeID")

sql3 = "select * from Event where EventID = " & EventID
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  AOBA = rs3("AOBA")
  AOBAFee = rs3("AOBAFee")
end if
rs3.close

if AOBA = True and len(AOBAFee) > 0 then
  ShowAOBAFee = "True"
end if



sql3 = "select * from Services where EventID = " & EventID
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  ServiceTypeLookupID = rs3("ServiceTypeLookupID")
end if



 sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID
 'response.write(sql3)
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
 sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")

	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")

	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")

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
	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")

	StallMatPrice = rs("StallMatPrice")
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 
if len(Price1DiscountStartDateMonth) > 0 and len(Price1DiscountStartDateDay) > 0 and len(Price1DiscountStartDateYear) > 0 then
	Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
end if
if len(Price1DiscountEndDateMonth) > 0 and len(Price1DiscountEndDateDay) > 0 and len(Price1DiscountEndDateYear) > 0 then
	Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear
end if


if len(Price2DiscountStartDateMonth) > 0 and len(Price2DiscountStartDateDay) > 0 and len(Price2DiscountStartDateYear) > 0 then
	Price2DiscountStartDate = Price2DiscountStartDateMonth & "/" & Price2DiscountStartDateDay & "/" & Price2DiscountStartDateYear
end if
if len(Price2DiscountEndDateMonth) > 0 and len(Price2DiscountEndDateDay) > 0 and len(Price2DiscountEndDateYear) > 0 then
	Price2DiscountEndDate = Price2DiscountEndDateMonth & "/" & Price2DiscountEndDateDay & "/" & Price2DiscountEndDateYear
end if

if len(Price3DiscountStartDateMonth) > 0 and len(Price3DiscountStartDateDay) > 0 and len(Price3DiscountStartDateYear) > 0 then
	Price3DiscountStartDate = Price3DiscountStartDateMonth & "/" & Price3DiscountStartDateDay & "/" & Price3DiscountStartDateYear
end if
if len(Price3DiscountEndDateMonth) > 0 and len(Price3DiscountEndDateDay) > 0 and len(Price3DiscountEndDateYear) > 0 then
	Price3DiscountEndDate = Price3DiscountEndDateMonth & "/" & Price3DiscountEndDateDay & "/" & Price3DiscountEndDateYear
end if

if len(Price4DiscountStartDateMonth) > 0 and len(Price4DiscountStartDateDay) > 0 and len(Price4DiscountStartDateYear) > 0 then
	Price4DiscountStartDate = Price4DiscountStartDateMonth & "/" & Price4DiscountStartDateDay & "/" & Price4DiscountStartDateYear
end if
if len(Price4DiscountEndDateMonth) > 0 and len(Price4DiscountEndDateDay) > 0 and len(Price4DiscountEndDateYear) > 0 then
	Price4DiscountEndDate = Price4DiscountEndDateMonth & "/" & Price4DiscountEndDateDay & "/" & Price4DiscountEndDateYear
end if

if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 

if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
end if

rs.close
%>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

	
<!--#Include file="EventHeader.asp"-->
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr><td class = "body" colspan = "2" ><br><h1>Register for <%=EventName %></h1>
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
  <tr><td>
  
  
 <% RegistrationOpen = True 

if len(ServiceEndDate) < 6  then %>
<center><h2>The Registration End Date on this Show Has Not Been Determined</h2></center>
<% end if %>


<% if len(ServiceEndDate) > 6 and DateDiff("d", ServiceEndDate, now()) > 1 then
  RegistrationOpen = False %>
<center><h2>Registration is Closed</h2>
Regestration for this show ended on <%=ServiceEndDate %></center>
<% end if %>

<% if len(ServiceStartDate) > 6 and DateDiff("d", ServiceStartDate, now()) < 1 then
  RegistrationOpen = False %>
<center><h2>Registration Has Not Opened Yet</h2>
Registration will open on <%=ServiceStartDate %></center>
<% end if %>

  <% if RegistrationOpen = True and len(ServiceEndDate) > 6 then %>
<center><h2>Registration is Open</h2>
Regestration for this show ends on <%=ServiceEndDate %></center>
<% end if %>

  
  
  
  </td></tr>
</table>


<% if RegistrationOpen = True and Session("LoggedIn") = true and len(PeopleID) > 0 then %>



 
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr>
<td class = "body">
Please select the links below to register for <%=EventName %>: <br><br> 
</td>
</tr>
</table>

<% if ShowFleeceShow = True or ShowVendors = True or ShowStudauction = True or ShowSpinOff = True or ShowSponsors = True or ShowAdvertising = True or ShowClasses = True or ShowDinner = True or ShowSilentAuction = True then %>
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr>
<td class = "body">
	<h3><a href = "EventRegisterGeneral.asp?EventID=<%=EventID%>" >General Registration</a></h3>
	Make your registration selections and pay for your registration.<br><br>
	<a href = "EventRegisterGeneral.asp?EventID=<%=EventID%>" class= "body" >General Registration</a> 
</td>
</tr>
</table>

<% end if %>

<% if ShowHalterShow = True then %>
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr>
<td class = "body">
	<a href = "EventRegisterHalter.asp?EventID=<%=EventID%>" class= "body" >Register Your Animals</a><br> 
</td>
</tr>
</table>

   <% End If %>


<% if ShowFleeceShow = True  then %>
       <table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr>
<td class = "body">
	<a href = "EventRegisterFleece.asp?EventID=<%=EventID%>" class= "body" >Register Your Fleece Show Entries<br><br> 
</td>
</tr>
</table>

   <% End If %>

<% if ShowSpinOff = True  then %>
       <table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr>
<td class = "body">
	<a href = "EventRegisterSpinOff.asp?EventID=<%=EventID%>" class= "body" >Register Your Spin-Off Entries<br><br> 
</td>
</tr>
</table>

   <% End If %>










<% end if ' REGISTRATION IS OPEN %>
<% if Session("LoggedIn") = true and len(PeopleID) > 0 then %>

<% else %>
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr><td class = "body" colspan = "2" ><br>
<h2>Please Sign In</h2>
Before you can create or update your registration you need to sign in. Please select <a href = "regcreateSignIn.asp?Action=Register&ReturnFileName=<%=FileName%>&ReturnEventID=<%=EventID%>" class = "body">Sign In</a> to get started. 

</td></tr>
</table>
<% end if %>

 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

