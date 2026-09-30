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
<meta name="keywords" content="Event Registration">
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpacas Shows" >
<link rel="shortcut icon" href="file:///infinityknot.ico" > 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" > 
<meta name="author" content="The Andresen Goup" >
<link rel="stylesheet" type="text/css" href="Style.css">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

	
<!--#Include file="EventHeader.asp"-->
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=bodywidth -50 %>" align = "center">	
<tr><td class = "body2" colspan = "2" ><h1>Register for <%=EventName %></h1>
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>

 <% if Session("LoggedIn") = true then %>
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=bodywidth -50 %>" align = "center">	
<tr>
<td class = "body">
Select the links below to add your selections for the options available at <%=EventName %>. Your registration will not be finalized until you make your payment.<br><br> 
</td>
</tr>
</table>





	
<%


PeopleID = request.querystring("PeopleID")
if len(PeopleID) < 1 then 
Session("PeopleID") = PeopleID
end if 
'response.write("PeopleID=" & peopleID)

EventSubTypeID = request.querystring("EventSubTypeID")


sql3 = "select * from Services where EventID = " & EventID'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  ServiceTypeLookupID = rs3("ServiceTypeLookupID")
end if



 sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID'response.write(sql3)
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
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	VetCheckFee = rs("VetCheckFee")
	ElectrictyFee = rs("ElectrictyFee")
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

Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear

Price2DiscountStartDate = Price2DiscountStartDateMonth & "/" & Price2DiscountStartDateDay & "/" & Price2DiscountStartDateYear
Price2DiscountEndDate = Price2DiscountEndDateMonth & "/" & Price2DiscountEndDateDay & "/" & Price2DiscountEndDateYear

Price3DiscountStartDate = Price3DiscountStartDateMonth & "/" & Price3DiscountStartDateDay & "/" & Price3DiscountStartDateYear
Price3DiscountEndDate = Price3DiscountEndDateMonth & "/" & Price3DiscountEndDateDay & "/" & Price3DiscountEndDateYear

Price4DiscountStartDate = Price4DiscountStartDateMonth & "/" & Price4DiscountStartDateDay & "/" & Price4DiscountStartDateYear
Price4DiscountEndDate = Price4DiscountEndDateMonth & "/" & Price4DiscountEndDateDay & "/" & Price4DiscountEndDateYear

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

ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)

RegistrationOpen = True 

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


<% if RegistrationOpen = True then %>
<form action= 'EventRegister.asp?EventID=<%=EventID%>' method = "post">
<table  border="1"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=bodywidth -50 %>" align = "center">	
<tr>
  <td class = "body" align = "center"><b>Service</b></td>
  <td class = "body" align = "center" width = "90"><b>Price Each</b></td>
  <td class = "body" align = "center" width = "90"><b>Quantity</b></td>
  <td class = "body" align = "center" width = "90"><b>Total</b></td>
</tr>







<% if  ShowHalterShow = True  then %>



<%
'************************************************************
'  ANIMAL STALLS
'************************************************************
%>

<% if  FeePerPen > 0 then
AnimalStallQTY = request.form("AnimalStallQTY")
 showdiscount = False
if len(Price2Discount) > 0 and len(Price2DiscountStartDate) > 4 and len(Price2DiscountStartDate) > 4 then
  if DateDiff("d", Price2DiscountStartDate, now()) > 1 and DateDiff("d", Price2DiscountEndDate, now()) < 1 then
 	 FullPriceFeePerPen = FeePerPen
 	 FeePerPen = Price2Discount
 	  showdiscount = True
	end if 
end if

if len(AnimalStallQTY) > 0  and len(FeePerPen) > 0 then
	AnimalStallTotal = AnimalStallQTY * FeePerPen
else
	AnimalStallTotal = 0
end if 

 %>
<tr>
  <td class = "body">
  <% if len(FeePerPen) > 1 then %>
  Animal Stalls 
  <% if len(MaxQTY) > 0 or len(MaxQTY2) > 0 then %><small>-<% end if %>
  	<% if len(MaxQTY2) > 0 then %><%=MaxQty2%> adults <% end if %>
  	<% if len(MaxQTY) > 0 and len(MaxQTY2) > 0 then %> OR <% end if %>
  	 <% if len(MaxQTY) > 0 then %><%=MaxQty%> juveniles per stall <% end if %>  
   <% if len(MaxQTY) > 0 or len(MaxQTY2) > 0 then %></small><% end if %>
  <% if showdiscount = True then %>
 	 <br><font color = "red">Discount Rate from <%=Price2DiscountStartDate %> To <% =Price2DiscountEndDate %>.</font>
	<% end if %>

 </td>
  <td class = "body" align = "right">
    <% if showdiscount = True then %>   
 	   <font color = "red"><strike><%=formatcurrency(FullPriceFeePerPen,2)%></strike></font><img src = "images/px.gif" width = "10" alt = "Event Registration"><br>
 			<%=formatcurrency(FeePerPen,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerPen,2)%>
	
<% end if %>


  


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
  <% if len(MaxPensPerFarm) > 0 then
     else
      MaxPensPerFarm = 50
     end if %>
  <select size="1" name="AnimalStallQTY" onchange="submit();">
  	<% if len(AnimalStallQTY) > 0 then %>
  	<option value="<%=AnimalStallQTY%>"><%=AnimalStallQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < (MaxPensPerFarm + 1) %>
  		<option value="<%=x%>"><%=x%></option>

	<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right"> <%=formatcurrency(AnimalStallTotal,2)%><img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
</tr> 

<% end if %>



<%
'************************************************************
'  DISPLAY STALLS
'************************************************************
%>

<% if  Price3 > 0 then
DisplayStallQTY = request.form("DisplayStallQTY")
 showdiscount = False
if Price3Discount > 0 and len(Price3DiscountStartDate) > 5 and len(Price3DiscountStartDate) > 5 then
  if DateDiff("d", Price3DiscountStartDate, now()) > 1 and DateDiff("d", Price3DiscountEndDate, now()) < 1 then
 	 FullPricePrice3 = Price3
 	 Price3 = Price3Discount
 	  showdiscount = True
	end if 
end if

if len(AnimalStallQTY) > 0  and len(Price3) > 0 then
	DisplayStallTotal = DisplayStallQTY * Price3
else
	DisplayStallTotal = 0
end if 

 %>
<tr>
  <td class = "body">

  Display Stalls 
  <% if showdiscount = True then %>  
 	 <br><font color = "red">Discount rate from <%=Price3DiscountStartDate %> to <% =Price3DiscountEndDate %>.</font>
	<% end if %>

 </td>
  <td class = "body" align = "right">
    <% if showdiscount = True then %>   
 	   <font color = "red"><strike><%=formatcurrency(FullPricePrice3,2)%></strike></font><img src = "images/px.gif" width = "10" alt = "Event Registration"><br>
 			<%=formatcurrency(Price3,2)%>
 			<% else %>
	  <%=formatcurrency(Price3,2)%>
	
<% end if %>


  


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
  <select size="1" name="DisplayStallQTY" onchange="submit();">
  	<% if len(DisplayStallQTY) > 0 then %>
  	<option value="<%=DisplayStallQTY%>"><%=DisplayStallQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < (MaxDisplaysPerFarm + 1) %>
  		<option value="<%=x%>"><%=x%></option>

	<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right"> <%=formatcurrency(DisplayStallTotal,2)%><img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
</tr> 

<% end if %>




<%
'************************************************************
'  HALTER SHOW ENTRIES
'************************************************************
%>

<% if  FeePerAnimal > 0 then
AnimalQTY = request.form("AnimalQTY")

 showdiscount = False
if Price1Discount > 0 and len(Price1DiscountStartDate) > 5 and len(Price1DiscountStartDate) > 5 then
  if DateDiff("d", Price1DiscountStartDate, now()) > 1 and DateDiff("d", Price1DiscountEndDate, now()) < 1 then
 	 FullPricePrice1 = FeePerAnimal
 	 FeePerAnimal = Price1Discount
 	  showdiscount = True
	end if 
end if

if len(AnimalQTY) > 0  and len(FeePerAnimal) > 0 then
	AnimalTotal = AnimalQTY * FeePerAnimal
	else
	AnimalTotal = 0
end if 
response.write("AnimalStallQTY=" & AnimalStallQTY )

 %>
<tr>
  <td class = "body">

 Halter Show Entries 
 <% if AnimalStallQTY = 0 then %>
 <br><font color = "red">Before you add animals please select stalls to put them in.</font>

<% end if %> 
  <% if showdiscount = True then %>  
 	 <br><font color = "red">Discount rate from <%=Price1DiscountStartDate %> to <% =Price1DiscountEndDate %>.</font>
	<% end if %>

 </td>
  <td class = "body" align = "right">
    <% if showdiscount = True then %>   
 	   <font color = "red"><strike><%=formatcurrency(FullPricePrice1,2)%></strike></font><img src = "images/px.gif" width = "10" alt = "Event Registration"><br>
 			<%=formatcurrency(FeePerAnimal,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerAnimal,2)%>
	
<% end if %>


  


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
  <select size="1" name="AnimalQTY" onchange="submit();">
  	<% if len(AnimalQTY) > 0 then %>
  	<option value="<%=AnimalQTY%>"><%=AnimalQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < ((AnimalStallQTY * MaxQty2) + 1) %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right"> <%=formatcurrency(AnimalTotal,2)%><img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
</tr> 

<% end if %>




<%
'************************************************************
'  PRODUCTION CLASS HALTER SHOW ENTRIES
'************************************************************
%>

<% if  Price4 > 0 then
Price4QTY = request.form("Price4QTY")

 showdiscount = False
 
if Price4Discount > 0 and len(Price4DiscountStartDate) > 5 and len(Price4DiscountStartDate) > 5 then
  if DateDiff("d", Price4DiscountStartDate, now()) > 1 and DateDiff("d", Price4DiscountEndDate, now()) < 1 then
 	 FullPricePrice4 = Price4
 	 Price4 = Price4Discount
 	  showdiscount = True
	end if 
end if

if len(Price4QTY) > 0  and len(FeePerAnimal) > 0 then
	Price4Total = Price4QTY * FeePerAnimal
	else
	Price4Total = 0
end if 

 %>
<tr>
  <td class = "body">

 Halter Show Production Class Entries
 <% sqlp = "select * from AnimalProductionClassesLookup where SpeciesID = 1"
			'response.write(sql)
			Set rsp = Server.CreateObject("ADODB.Recordset")
			rsp.Open sqlp, conn, 3, 3
			if not rsp.eof then %><% i = 0
				 while Not rsp.eof  
				AnimalProductionLookupID = rsp("AnimalProductionLookupID")
				ProductionClassName = rsp("ProductionClassName") 
				 sqlp2 = "select * from AnimalProductionClasses where AnimalProductionLookupID = " & AnimalProductionLookupID & " and EventID =" & EventID
				'response.write(sqlp2)
				Set rsp2 = Server.CreateObject("ADODB.Recordset")
				rsp2.Open sqlp2, conn, 3, 3
					if not rsp2.eof then 
					 i = i + 1 
					 if i > 1 then %>, <% else %><small>-<% end if %><%=ProductionClassName%>
				<% end if 
				rsp2.close 
				 rsp.movenext
			wend 
			rsp.close %>
			</small><% end if %>

 
 <% if AnimalStallQTY = 0 then %>
 <br><font color = "red">Before you add animals please select stalls to put them in.</font>

<% end if %> 
  <% if showdiscount = True then %>  
 	 <br><font color = "red">Discount rate from <%=Price4DiscountStartDate %> to <% =Price4DiscountEndDate %>.</font>
	<% end if %>

 </td>
  <td class = "body" align = "right">
    <% if showdiscount = True then %>   
 	   <font color = "red"><strike><%=formatcurrency(FullPricePrice4,2)%></strike></font><img src = "images/px.gif" width = "10" alt = "Event Registration"><br>
 			<%=formatcurrency(Price4,2)%>
 			<% else %>
	  <%=formatcurrency(Price4,2)%>
	
<% end if %>


  


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
  <select size="1" name="Price4QTY" onchange="submit();">
  	<% if len(Price4QTY) > 0 then %>
  	<option value="<%=Price4QTY%>"><%=Price4QTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < ((AnimalStallQTY * MaxQty2) + 1) %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right"> <%=formatcurrency(Price4Total,2)%><img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
</tr> 

<% end if %>



<%
'************************************************************
'  COMPANION ANIMALS
'************************************************************
%>
<% if  ShowHalterShow = True  then %>
<% UnshownQTY = request.form("UnshownQTY") %>
<tr>
  <td class = "body">

  Companion Animals <small>(animals that will not be shown)</small>
 <% if AnimalStallQTY = 0 then %>
 <br><font color = "red">Before you add animals please select stalls to put them in.</font>

<% end if %> 

 
 </td>
  <td class = "body" align = "right">
  N/A


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
   <select size="1" name="UnshownQTY" onchange="submit();">
  
  <% if AnimalStallQTY = 0 then %> 
  	<option value="0">0</option>

  <% else %>

  	<% if len( UnshownQTY) > 0 then %>
  	<option value="<%= UnshownQTY%>"><%= UnshownQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < ((AnimalStallQTY * MaxQty2) + 1 - AnimalQTY) %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend 
	
	end if %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right">  
  N/A
<img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
</tr> 

<% end if %>







<%
'************************************************************
'  VET CHECK FEE
'************************************************************
%>

<% if  VetCheckFee > 0 then
Price4QTY = request.form("Price4QTY")

 showdiscount = False
 
if Price4Discount > 0 and len(Price4DiscountStartDate) > 5 and len(Price4DiscountStartDate) > 5 then
  if DateDiff("d", Price4DiscountStartDate, now()) > 1 and DateDiff("d", Price4DiscountEndDate, now()) < 1 then
 	 FullPricePrice4 = Price4
 	 Price4 = Price4Discount
 	  showdiscount = True
	end if 
end if

if len(Price4QTY) > 0  and len(FeePerAnimal) > 0 then
	Price4Total = Price4QTY * FeePerAnimal
	else
	Price4Total = 0
end if 

 %>
<tr>
  <td class = "body">

  Mandatory Vet Check Fee
 
 <% if AnimalQTY = 0 and Price4QTY = 0 then %>
 <br><font color = "red">This fee will automatically be added if you register animals.</font>

<% end if %> 

 </td>
  <td class = "body" align = "right">
  <%=formatcurrency(VetCheckFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
  <% if AnimalQTY > 0 or Price4QTY > 0 then %>
	1
  <% else %>
  	N/A
  <% end if %>
  


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right">  
  <% if AnimalQTY > 0 or Price4QTY > 0 then %>
	 <%=formatcurrency(VetCheckFee,2)%>
<% end if %><img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
</tr> 

<% end if %>





</table>
<% end if %>



	
<% end if %>



</form>

	
<% if  ShowFleeceShow = True  then %>
  

<% end if %>


<% 

if ShowVendors = True  then %>

<table border = "0" width = "<%=bodywidth -50 %>"  align = "center"  >
<tr>
<td valign = "top">


<% 
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Vendors' and EventID =  " & EventID & " Order by services.ServiceTypeLookupID "
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	ServiceEndDate = rs("ServiceEndDateMonth") & "/" & rs("ServiceEndDateDay") & "/" & rs("ServiceEndDateYear")
	maxQTY2 =  rs("ServiceMaxQuantity")
	if len(MaxQTY2) > 0 then
	  MaxQTY = "checked"
	end if


	
End If 

if MaxDate = "True" and ServiceEndDate < FormatDateTime(Date) then

else

row = "odd"
rowcount = 1

sql = "select * from VendorLevels  where EventID = " & EventID
'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>

<table width = "<%=bodywidth -50 %>" border = "1"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Vendor Options</h2>
</td>
</tr>
<tr>
<td>
<table border = "0" width = "600"  align = "center" >
<tr>
	<td class = "body2" colspan = "4" valign = "top">
	<% if ServiceEndDate < FormatDateTime(Date) and len(ServiceEndDate) > 4 then %>
		<B>Registration ends: <%=ServiceEndDate%></b><br>
	<% end if %>
</td>
</tr>

	<tr>
	<td class = "body2" width = "130" align = "center"><b>Add to Cart</b></td>
	<td class = "body2" width = "70" align = "center"><b>Quantity</b></td>
	<td class = "body2" width = "50" align = "center"><b>Price</b></td>
	<td class = "body2" width = "350" align = "center"><b>Vendor Option</b></td>
	</tr>
	<tr><td colspan = "4">
	
<%	While Not rs.eof  
	
	VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	VendorStallPrice= rs("VendorStallPrice")
	VendorStallQTYAvailable = rs("VendorStallQTYAvailable")
	VendorStallPower = rs("VendorStallPower")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	

If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0" width = "600"  align = "center" bgcolor = "#DBF5F3">
<% Else %>
	<table border = "0" width = "600"  align = "center" bgcolor = "white" >
<% End If %>
  		
<% 
VendorBoothQTY = 0
 MaxCountFound = False

sql2 = "select VendorBoothQTY from Vendor where VendorLevelID = " & VendorLevelID
'response.write (sq2l)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
if not rs2.eof then 
while not rs2.eof
 VendorBoothQTY = VendorBoothQTY + rs2("VendorBoothQTY")
rs2.movenext
wend
end if 
rs2.close


VendorStallQTYAvailable = VendorStallQTYAvailable - VendorBoothQTY
if VendorStallMaxQtyPer > 1 then


	if VendorStallMaxQtyPer < VendorStallQTYAvailable then
   		MaxCount = VendorStallMaxQtyPer
   		MaxCountFound = True
	end if 

	if VendorStallQTYAvailable < VendorStallMaxQtyPer and  MaxCountFound = False then
  		MaxCount = VendorStallQTYAvailable
      	MaxCountFound = True
	end if 
	
	

end if

if VendorStallQTYAvailable > 0 and MaxCountFound = False then
   MaxCount = VendorStallQTYAvailable
   	MaxCountFound = True

end if 

if  MaxCountFound = False then
   MaxCount = 1
end if 


%>
 <tr>
   	<td class = "body2" width = "130" align = "center">


<% if VendorStallQTYAvailable = 0 then %>

Sold Out


<% else %>
  <input type="checkbox" name="VendorOrdered(<%=rowcount%>)" >Add</td>
<td class = "body2" align = "center" width = "70">
<%  if MaxCount > 1 then 
   i = 1 %>
 <select size="1" name="VendorQtyOrdered(<%=rowcount%>)">
   <option value= "1" selected>1</option>

 <%  while i < MaxCount + 1 
%>
	<option value= "<%=i%>" ><%=i %></option>
<% i = i + 1 
  wend %>
 </select>
<% else %>
	<input type = "hidden" name="VendorQtyOrdered(<%=rowcount%>)" value = "1">1
<% end if %>

</td>
<td class = "body2" width = "50" align= "right"> <b>$<%=VendorStallPrice %></b><img src = "images/px.gif" width = "9" height = "1"></td>
<td class = "body2" width = "350"><a href="Eventvendors.asp?EventID=<%=EventID%>" class = "body2" ><b><%= VendorStallName %></b></a>	
<input type = "hidden" name="VendorLevelID(<%=rowcount%>)" value= "<%= VendorLevelID %>" ></td>
 
</tr>

 <% end if %>

 </table>

<% rowcount = rowcount + 1
		rs.movenext
	Wend		
vendorrowcount = rowcount
rowcount = 1
%>


</table>
</td>
</tr></table>
</td></tr></table>


<% end if %>


<% end if %>

<input type="hidden" name="vendorrowcount" value="<%=vendorrowcount%>"  >

<% end if %>
















 <% if ShowSponsors = True  then %>


<table width = "<%=bodywidth -50 %>" border = "1"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Sponsorship Options</h2>
</td>
</tr>
<tr>
<td>
<table border = "0" width = "600"  align = "center" >
	<tr>
	<td class = "body2" width = "130" align = "center"><b>Add to Cart</b></td>
	<td class = "body2" width = "70" align = "center"><b>Quantity</b></td>
	<td class = "body2" width = "50" align = "center"><b>Price</b></td>
	<td class = "body2" width = "350" align = "center"><b>Sponsorship Level</b></td>

	</tr>
	<tr><td colspan = "4">

<% 
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Sponsor' and EventID =  " & EventID & " Order by ServiceEndDateYear ASC"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then

	ServiceEndDate = rs("ServiceEndDateMonth") & "/" & rs("ServiceEndDateDay") & "/" & rs("ServiceEndDateYear")
	maxQTY2 =  rs("ServiceMaxQuantity")
	if len(MaxQTY2) > 0 then
	  MaxQTY = "checked"
	end if

	MaxDate =  rs("MaxDate")
	if MaxDate = "True" then
	  StopDate = "checked"
	end if
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


if MaxDate = "True" and ServiceEndDate > FormatDateTime(Date) and len(ServiceEndDate) > 4  then


else

row = "odd"
rowcount = 1

sql = "select * from SponsorshipLevels  where EventID = " & EventID
'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>
<%	While Not rs.eof  
	
	SponsorshipLevelID = rs("SponsorshipLevelID")
	SponsorshipLevelName = rs("SponsorshipLevelName")
	SponsorshipLevelDescription = rs("SponsorshipLevelDescription")
	SponsorshipLevelPrice= rs("SponsorshipLevelPrice")
	SponsorshipLevelQTYAvailable = rs("SponsorshipLevelQTYAvailable")
	SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")


str1 = SponsorshipLevelDescription 
str2 = vblf
If InStr(str1,str2) > 0 Then
	SponsorshipLevelDescription= Replace(str1, str2 , "")
End If  

str1 = SponsorshipLevelDescription
str2 = vbtab
If InStr(str1,str2) > 0 Then
	SponsorshipLevelDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = SponsorshipLevelDescription
str2 = vbcrlf
If InStr(str1,str2) > 0 Then
	SponsorshipLevelDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = SponsorshipLevelDescription
str2 = vbcr
If InStr(str1,str2) > 0 Then
	SponsorshipLevelDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = SponsorshipLevelDescription
str2 = vblf
If InStr(str1,str2) > 0 Then
	SponsorshipLevelDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If 

str1 = SponsorshipLevelDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	SponsorshipLevelDescription= Replace(str1, str2 , "")
End If 

Mouseovertext = Cstr(SponsorshipLevelDescription)
	
	
	If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0" width = "600"  align = "center" bgcolor = "#DBF5F3">
<% Else %>
	<table border = "0" width = "600"  align = "center" bgcolor = "white" >
<% End If %>
 <tr>
   	<td class = "body2" width = "130" align = "center">
   
   
   
   
<% 
SponsorQTY = 0
 MaxCountFound = False

sql2 = "select SponsorQTY from Sponsor where SponsorshiplevelID = " & SponsorshiplevelID
'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
if not rs2.eof then 
while not rs2.eof
 SponsorQTY = SponsorQTY + rs2("SponsorQTY")
rs2.movenext
wend
end if 
rs2.close


SponsorshipLevelQTYAvailable = SponsorshipLevelQTYAvailable - SponsorQTY
if SponsorshipLevelMaxQtyPer > 1 then


	if SponsorshipLevelMaxQtyPer < SponsorshipLevelQTYAvailable then
   		MaxCount = SponsorshipLevelMaxQtyPer
   		MaxCountFound = True
	end if 

	if SponsorshipLevelQTYAvailable < SponsorshipLevelMaxQtyPer and  MaxCountFound = False then
  		MaxCount = SponsorshipLevelQTYAvailable
      	MaxCountFound = True
	end if 
	
	

end if

if SponsorshipLevelQTYAvailable > 0 and MaxCountFound = False then
   MaxCount = SponsorshipLevelQTYAvailable
   	MaxCountFound = True

end if 

if  MaxCountFound = False then
   MaxCount = 1
end if 


'response.write("SponsorshipLevelMaxQtyPer=" & SponsorshipLevelMaxQtyPer)
'response.write("SponsorshipLevelQTYAvailable=" & SponsorshipLevelQTYAvailable)
'response.write("MaxCount=" & MaxCount)



if SponsorshipLevelQTYAvailable = 0 then %>

Sold Out

  
<% else %>
  <input type="checkbox" name="SponsorOrdered(<%=rowcount%>)" >Add</td>
<td class = "body2" align = "center" width = "70">
<%  if MaxCount > 1 then 
   i = 1 %>
 <select size="1" name="SponsorQtyOrdered(<%=rowcount%>)">
   <option value= "1" selected>1</option>

 <%  while i < MaxCount + 1 
%>
	<option value= "<%=i%>" ><%=i %></option>
<% i = i + 1 
  wend %>
 </select>
<% else %>
	<input type = "hidden" name="SponsorQtyOrdered(<%=rowcount%>)" value = "1">1
<% end if %>

</td>
<td class = "body2" width = "50" align= "right"> <b>$<%=SponsorshipLevelPrice %></b><img src = "images/px.gif" width = "9" height = "1"></td>
<td class = "body2" width = "350"><a href="#" class = "body2" onmouseout="hideTooltip()" onmouseover="showTooltip(event, '<%= Mouseovertext %>' );return false"><b><%= SponsorshipLevelName %></b></a>	
<input type = "hidden" name="SponsorshipLevelID(<%=rowcount%>)" value= "<%= SponsorshipLevelID %>" ></td>
 
</tr>

  <% end if %>

 </table>

<% rowcount = rowcount + 1
		rs.movenext
	Wend		
Sponsorshiprowcount = rowcount
rowcount = 1
%>

</td>
</tr>
</table>
</td>
<td class = "body2" width = "400" valign = "top"><% if ServiceEndDate < FormatDateTime(Date) and len(ServiceEndDate) > 4 then %>
<B>Registration ends: <%=ServiceEndDate%></b><br>
<% end if %>
<%= Description %>&nbsp;
</td></tr></table>
</td></tr></table>


<% end if %>


<% end if %>

<input type="hidden" name="sponsorshiprowcount" value="<%=sponsorshiprowcount%>"  >

<% end if %>












 <% if ShowClasses = True  then %>



<% end if %>

<TABLE width = "<%=bodywidth -50 %>">
<tr>
	<td  align = "center" colspan = "2">
	<input type="hidden" name="PeopleID" value="<%=PeopleID%>"  >
	<input type="hidden" name="EventID" value="<%=EventID%>"  >
	<input type="hidden" name="EventSubTypeID" value="<%=EventSubTypeID%>"  >
		<input type=submit value="Sign Up "  STYLE="color: white;  font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #990000;" size ="100">
		</td>
</tr>
</table>


</form>
<% end if ' REGISTRATION IS OPEN %>
<% else %>
<br>
<h2>Please sign in</h2>
Before you can start registration you need to sign in. Please select <a href = "regcreateSignIn.asp?Action=Register&PageName=<%=PageName%>&EventID=<%=EventID%>" class = "body">Sign In</a> to get started. 
<% end if %>

 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

