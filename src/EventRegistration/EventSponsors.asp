<%@ Language="VBScript" %> 
<!DOCTYPE html>
<html>
<head>

<%  PageName = "Sponsor" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

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

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="EventHeader.asp"-->

<%
If Not Len(EventID)> 0 Then 
	EventID=Request.Form("EventID") 
	EventID=Request.QueryString("EventID") 
End if
%>
<br />
          <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=DescriptionWidth%>"><tr><td class = "roundedtop" align = "left" >
		<h1><%=EventName %> Sponsors</h1>
        </td></tr>
        <tr><td class = "roundedBottom">
<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=Textwidth %>" align = "center" >
<tr>
<td class= "body" valign = "top" >
<% 

sql = "select Description, ShowSupporters  from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Sponsor' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then

	Description =  rs("Description")
	ShowSupporters = rs("ShowSupporters")

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
str2 = "'"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "''")
End If 

	
End If 

%>



<%= Description%> </td>
<br />
</td>
</tr>
</table>


<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=Textwidth %>" align = "center" >
	<tr>
	   <td width = "<%=Textwidth / 2 %>" valign = "top">
<table border = "0" cellpadding=0 cellspacing=0 width = "<%=Textwidth / 2 %>" align = "center">
	<tr>
		<td Class = "body"><H2>Sponsor Options </H2>
		</td>
	</tr>
		<tr><td class = "Menu2" colspan  "3" bgcolor = "#abacab" height = "1"></td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
 sql = "select * from SponsorshipLevels  where EventID = " & EventID 
 
    Set rsY = Server.CreateObject("ADODB.Recordset")
    rsY.Open sql, conn, 3, 3   
	if not rsY.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "<%=Textwidth / 2 %>" align = "center">
	
	<%
	
		dim ExtraOptionsIDArray(1000) 
 		dim SponsorshipLevelQTYarray(1000)
	order = "odd"
	While Not rsY.eof  
	 SponsorshipLevelID = rsY("SponsorshipLevelID")
SponsorshipLevelName = rsY("SponsorshipLevelName")
SponsorshipLevelPrice= rsY("SponsorshipLevelPrice")
SponsorshipLevelDescription= rsY("SponsorshipLevelDescription")
SponsorshipLevelQTYAvailable= rsY("SponsorshipLevelQTYAvailable")
SponsorshipLevelMaxQtyPer= rsY("SponsorshipLevelMaxQtyPer")
	
	
	
	
 sql3 = "select * from SponsorshipLevelbenefits, ExtraOptions where SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and  SponsorshipLevelID = " & SponsorshipLevelID & " and  ExtraOptions.EventID = " & EventID & ""
 

Set rsX = Server.CreateObject("ADODB.Recordset")
rsX.Open sql3, conn, 3, 3   
while Not rsX.eof


    if rsX("ExtraOptionsName") = "Free Halter Stall" then
    	FreeHalterStall = rsX("SponsorshipLevelQTY")
    	FreeHalterStallbenefitsID = rsX("SponsorshipbenefitsID")
    end if 
 
 
 
    if rsX("ExtraOptionsName") = "Free Display Stall" then
    	FreeDisplayStallQTY = rsX("SponsorshipLevelQTY")
    	FreeDisplayStallbenefitsID = rsX("SponsorshipbenefitsID")
    end if 



    if trim(rsX("ExtraOptionsName")) = "Expidited Vet Check in" then
    	ExpiditedVetCheckinQTY = rsX("SponsorshipLevelQTY")
     	ExpiditedVetCheckinbenefitsID = rsX("SponsorshipbenefitsID")
    end if 

    if rsX("ExtraOptionsName") = "Free Vet Check in" then
    	FreeVetCheckinQTY = rsX("SponsorshipLevelQTY")
    	FreeVetCheckinbenefitsID = rsX("SponsorshipbenefitsID")
    end if 

    if rsX("ExtraOptionsName") = "Free Stall Mat" then
    	FreeStallMatQTY = rsX("SponsorshipLevelQTY")
    	FreeHalterStallbenefitsID = rsX("SponsorshipbenefitsID")
    end if 


    if rsX("ExtraOptionsName") = "Free Electricity" then
    	FreeElectricityQTY = rsX("SponsorshipLevelQTY")
    	FreeHalterStallbenefitsID = rsX("SponsorshipbenefitsID")
    end if

	if rsX("ExtraOptionsName") = "Free Dinner Ticket(s)" then
    	FreeDinnerTickets = rsX("SponsorshipLevelQTY")
    	FreeHalterStallbenefitsID = rsX("SponsorshipbenefitsID")
    end if

		
		

	rsX.movenext
wend

%>

<tr>
 			<td class = "body2" >

	<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "420" align = "center" >
 		<tr>
 			<td class = "body2" colspan = "2"><h2><%=SponsorshipLevelName%></h2>
 			<% if len(SponsorshipLevelPrice) > 0 then %>
 			Price: <%=formatcurrency(SponsorshipLevelPrice,2) %><br />
 		<% end if %>
 		 <% if len(SponsorshipLevelQTYAvailable) > 0 then %>
 			# Available: <%=SponsorshipLevelQTYAvailable %><br />
 		<% end if %>
 		<% if len(SponsorshipLevelDescription) > 0 then %>	
             <%=SponsorshipLevelDescription%><br />
 		<% end if %>
 			</td>
 		</tr>
 		
		
		<%
		sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"
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
end if
		
		

		%>
		
		
	
	
		
	<% if  FreeHalterStall > 0 then%>	
  		<tr><td class = "body2" ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /><%=FreeHalterStall%> Free Halter Stall(s)</td></tr>
   	<% end if %> 		

	<% if  FreeDisplayStallQTY > 0 then%>	
  		<tr><td class = "body2"  ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /><%=FreeDisplayStallQTY%> Free Display Stall(s)</td></tr>
  	<% end if %>
  	
  	<% if  FreeStallMatQTY > 0 then%>
  		<tr><td class = "body2" ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" />Expedited Vet Check In</td></tr>
  	<% end if %>

  		
  		 	<% if  FreeStallMatQTY > 0 then%>
  		<tr><td class = "body2"  ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" />Free Vet Check In</td></tr>
  			<% end if %>
  		

	  	<% if  FreeStallMatQTY > 0 then%>
  		<tr><td class = "body2" ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /><%=FreeStallMatQTY%> Free Stall Mats</td></tr>
  		<% end if %>
  	<% if  FreeElectricityQTY > 0 then%>
  		<tr><td class = "body2" ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" />Free Electricity</td></tr>
<% end if %>


 		<% sql = "select * from ExtraOptions, AdvertisingLevels where ExtraOptions.ExtraOptionsname = Advertisinglevels.AdvertisingLevelName and OptionType = 'Advertising' and ExtraOptions.EventID = " & EventID
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3   
			Advertisingrowcount = 0
			while Not rs.eof 
			Advertisingrowcount = Advertisingrowcount + 1
				AdvertisingLevelName = rs("AdvertisingLevelName")	
				sql2 = "select * from ExtraOptions, AdvertisingLevels where ExtraOptions.ExtraOptionsname = Advertisinglevels.AdvertisingLevelName and ExtraOptions.EventID = " & EventID & " and AdvertisingLevelName = '" & AdvertisingLevelName & "'"
		    	Set rs2 = Server.CreateObject("ADODB.Recordset")
    			rs2.Open sql2, conn, 3, 3 
    			Advertisingrowcount = 0
    			if not rs2.eof then 
    				Advertisingrowcount = Advertisingrowcount + 1 
    				ExtraOptionsID = rs2("ExtraOptionsID")
    				sql3 = "select SponsorshiplevelQTY from SponsorshipLevelBenefits where SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " & EventID & " and ExtraOptionID = " & ExtraOptionsID & ""
		    		Set rs3 = Server.CreateObject("ADODB.Recordset")
    				rs3.Open sql3, conn, 3, 3 
    				if not rs3.eof then 
    					SponsorshipLevelQTY = rs3("SponsorshipLevelQTY")
    				end if 
    				rs3.close
    				if SponsorshipLevelQTY > 0 then 
    				%>
			  		<tr><td class = "body2"  ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /><%=SponsorshipLevelQTY%>&nbsp;<%=rs2("AdvertisingLevelName")%></td>
  				</tr>
			<% 
			end if
			end if  
	 rs.movenext
	wend 
 		
 		sql = "select * from ExtraOptions, VendorLevels where ExtraOptions.ExtraOptionsname = Vendorlevels.VendorStallName and OptionType = 'Vendor' and vendorLevels.EventID = " & EventID
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3   
			vendorrowcount = 0
			while Not rs.eof 
			vendorrowcount = vendorrowcount + 1
				VendorStallName = rs("VendorStallName")	
				
						str1 =VendorStallName
		str2 = "'"
		If InStr(str1,str2) > 0 Then
			VendorStallName= Replace(str1,  str2, "''")
		End If  
				sql2 = "select * from ExtraOptions, VendorLevels where ExtraOptions.ExtraOptionsname = Vendorlevels.VendorStallName and VendorLevels.EventID = " & EventID & " and VendorStallName = '" & VendorStallName & "'"
			
		    	Set rs2 = Server.CreateObject("ADODB.Recordset")
    			rs2.Open sql2, conn, 3, 3 
    			vendorrowcount = 0
    			if not rs2.eof then 
    				vendorrowcount = vendorrowcount + 1 
    				ExtraOptionsID = rs2("ExtraOptionsID")
    				sql3 = "select SponsorshiplevelQTY from SponsorshipLevelBenefits where SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " & EventID & " and ExtraOptionID = " & ExtraOptionsID & ""
    				
    	str1 =VendorStallName
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			VendorStallName= Replace(str1,  str2, "'")
		End If  	
    				
		    		Set rs3 = Server.CreateObject("ADODB.Recordset")
    				rs3.Open sql3, conn, 3, 3 
    				if not rs3.eof then 
    					SponsorshipLevelQTY = rs3("SponsorshipLevelQTY")
    				end if 
    				rs3.close
    				if SponsorshipLevelQTY > 0 then
    				%>
			  		<tr><td class = "body2" ><img src = "images/px.gif" width = "10" height = "1" alt ="<%= EventName %> Event Registration" /><%=SponsorshipLevelQTY%>&nbsp;<%=rs2("VendorStallName")%></td>
  				</tr>

			<% 
			end if
			end if  
	 rs.movenext
	wend 
%>

<% if FreeDinnerTickets > 0 then %>
		<tr><td class = "body2"  ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /><%=FreeDinnerTickets%> Free Dinner Ticket(s)</td></tr>
<% end if %>
 		
  		
  		<% sql = "select * from ExtraOptions where not (OptionType = 'Halter')  and not (OptionType = 'Advertising') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor') and ExtraOptions.EventID = " & EventID
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3   
			while Not rs.eof
			ExtraOptionsID = rs("ExtraOptionsID") 
			sql3 = "select SponsorshiplevelQTY from SponsorshipLevelBenefits where  SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " & EventID & " and ExtraOptionID = " & ExtraOptionsID & ""
			   		Set rs3 = Server.CreateObject("ADODB.Recordset")
    				rs3.Open sql3, conn, 3, 3 
    				if not rs3.eof then 
    					SponsorshipLevelQTY = rs3("SponsorshipLevelQTY")
    				end if 
    				rs3.close
			if len(SponsorshipLevelQTY) >0 then
				if SponsorshipLevelQTY >0 then
			%>
			
			<tr><td class = "body2" ><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /><%=SponsorshipLevelQTY%>&nbsp;<%=rs("ExtraOptionsName")%></td>	</tr>
  	
		<%
		end if
		end if
		 rs.movenext
		wend 
		
	 rowcount = rowcount + 1
		rsY.movenext %>
		<tr><td height = "20"><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /></td></tr>
	</table>	
<%	Wend		
%>
</table>

<%  end if %>


 </td>
 <td width = "10"><img src = "images/px.gif" width = "10" alt ="<%= EventName %> Event Registration" /></td>
 <td class = "body" width = "<%=(Textwidth/2) - 10 %>" valign = "top">
 <% if ShowSupporters=True then  %>
 <table border = "0"  cellpadding=0 cellspacing=0 width = "<%=(Textwidth/2) - 10 %>" align = "center" valign = "top">
	<tr>
	   <td  valign = "top"   colspan = "3"><h2>List of Sponsors</h2></td>
	</tr>
	<tr><td class = "body" bgcolor = "#abacab" height = "1"></td></tr>
	<tr><td class = "body" height = "10"></td></tr>
	 </table>


<%  sql = "select * from Registration where EventID = " & EventID & " and instr(ServiceDescription , 'Sponsorship') and Quantity > 0 order by ItemPrice desc"

    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql, conn, 3, 3   
	while not rs2.eof  
	  SponsorshipPeopleID = rs2("PeopleID")
SponsorshipLevel = right(rs2("ServiceDescription"), len(rs2("ServiceDescription")) -14)
	
sql = "select * from People where PeopleID = " & SponsorshipPeopleID 
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>

	<% else 
	While Not rs.eof  

PeopleFirstName = rs("PeopleFirstName")
PeopleLastName = rs("PeopleLastName")
PeoplePhone= rs("PeoplePhone")
PeopleCell= rs("PeopleCell")
PeopleFax= rs("Peoplefax")

'SponsorshipQTYExtraTables = rs("SponsorshipQTYExtraTables")
	'SponsorshipID = rs("SponsorshipID")
	SponsorshipBusinessID  = rs("BusinessID")
	BusinessID  = rs("BusinessID")
	SponsorshipAddressID = rs("AddressID")
	SponsorshipWebsitesID = rs("WebsitesID")
	'SponsorshipStallName = rs("SponsorshipStallName")
	'SponsorshipStallDescription = rs("SponsorshipStallDescription")
	'SponsorshipStallName = rs("SponsorshipStallName")
	'SponsorshipPaidAmount = rs("SponsorshipPaidAmount")
	'SponsorshipPaidAmountMonth  = rs("SponsorshipPaidAmountMonth")
	'SponsorshipPaidAmountDay = rs("SponsorshipPaidAmountDay")
	'SponsorshipPaidAmountYear = rs("SponsorshipPaidAmountYear")

	'SponsorshipStallPrice = rs("SponsorshipStallPrice")
	'SponsorshipBoothQTY= rs("SponsorshipBoothQTY")
	'SpecialRequests= rs("SpecialRequests")
	
Businessname = ""
BusinessLogo = ""
	'PeopleID = rs("PeopleID")
if len(BusinessID) > 0 then	
sql3 = "select * from Business  where BusinessID = " & SponsorshipBusinessID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	BusinessName = rs3("BusinessName")
	BusinessLogo = rs3("BusinessLogo")
end if 	
rs3.close
end if	

BusinessAddress = ""
	BusinessApt = ""
	BusinessCity = ""
	BusinessState = ""
	BusinessCountry = ""
BusinessZip = ""

if len(SponsorshipAddressID) > 0 then	
sql3 = "select * from Address where AddressID = " & SponsorshipAddressID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	BusinessAddress = rs3("AddressStreet")
BusinessAddressApt = rs3("AddressApt")
	BusinessCity = rs3("AddressCity")
	BusinessState = rs3("AddressState")
	BusinessCountry = rs3("Addresscountry")
BusinessZip = rs3("AddressZip")
end if 	
rs3.close
end if	


Website =""
if len(SponsorshipWebsitesID) > 0 then	
sql3 = "select * from Websites where WebsitesID = " & SponsorshipWebsitesID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	Website = rs3("Website")
end if 	
rs3.close
end if	
x = x + 1
%>

<table border = "0" width = "<%=(Textwidth/2) - 10 %>"  align = "center"  >

<tr>
<td width = "120" align = "center" valign = "top"><% if len(businessLogo)> 2 then %>
<Img src = "<%=BusinessLogo %>" width = "110" />
<% end if %>&nbsp;<br />
</td>
<td valign = "top" class = "body" >
<% if len(BusinessName) > 1 then%>
<b><%=BusinessName%></b><br />
<% end if %>
<b><%=PeopleFirstName%>&nbsp;<%=PeopleLastName%></b><br />

<% if len(BusinessHours) > 1 then%>
Open:&nbsp;<%=BusinessHours%><br />
<% end if %>
<% if len(Website) > 1 then%>
<a href = "http://<%=Website%>" class = "body" target = "blank"><%=Website%></a><br />
<% end if %>

<% if len(BusinessAddress) > 1 then%>
<%=BusinessAddress%><br />
<% end if %>
<% if len(BusinessAddressApt) > 0 then%>
<%=BusinessAddressApt%><br />
<% end if %>



<% if len(BusinessCity) > 1 then%>
<%=BusinessCity%>,
<% end if %> 
<% if len(BusinessState) > 1 then%>
<%=BusinessState%>&nbsp;
<% end if %>
<% if len(BusinessZip) > 1 then%>
<%=BusinessZip%>
<% end if %>

<br />
<% if len(PeoplePhone) > 3 then%>
		Phone: <%=PeoplePhone%><br />
<% end if %>	
	<% if len(PeopleCell) > 3 then%>
		Cell: <%=Peoplecell%><br />
<% end if %>	
	<% if len(PeopleFax) > 3 then%>
		Fax: <%=PeopleFax%><br />
<% end if %>	<br /><br />		
</tr>
</table>

<% rs.movenext
wend 
 end if 
 rs.close
	rs2.movenext
	wend
rs2.close
%>
	   	   
	   </td>
</tr>
 		</TABLE>
<% end if  %>	   </td>
	 </tr>
	</table>
</td>
	 </tr>
	</table>	<br /><br />
</td>
	 </tr>
	</table>

 <!--#Include file="EventFooter.asp"--> 

</body>
</html>

