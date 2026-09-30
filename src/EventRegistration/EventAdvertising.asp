<%@ Language="VBScript" %> 

<html>
<head>

<%  PageName = "Advertising" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

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

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include file="EventHeader.asp"-->

<%
If Not Len(EventID)> 0 Then 
	EventID=Request.Form("EventID") 
	EventID=Request.QueryString("EventID") 
End if
%>


<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=Textwidth %>" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br><h2><%=EventName %> Advertising</h2></td>
	</tr>
	<tr><td class = "body" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td class= "body" valign = "top" >
<% 

sql = "select Description, ShowSupporters  from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Advertising' and EventID =  " & EventID & " Order by ServicesID Desc"
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
		<td Class = "body"><H2>Advertising Options </H2>
		</td>
	</tr>
		<tr><td class = "Menu2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
 sql = "select * from AdvertisingLevels  where EventID = " & EventID 
 
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "<%=Textwidth / 2 %>" align = "center">
	
	<%
	order = "odd"
	While Not rs.eof  
	
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelDescription = rs("AdvertisingLevelDescription")
	AdvertisingLevelPrice= rs("AdvertisingLevelPrice")
	AdvertisingLevelQTYAvailable = rs("AdvertisingLevelQTYAvailable")
	AdvertisingDimensions= rs("AdvertisingDimensions")
	AvaliableWithSponsorships= rs("AvaliableWithSponsorships")
	AvaliableByItself= rs("AvaliableByItself")
	AdvertisingLocation= rs("AdvertisingLocation")
	%>

		<tr>
	     <td class="body" align = "left" >
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=3 cellspacing=0  align = "left" width = "<%=Textwidth /2 %>">
 <tr>
  	<td class = "body" colspan = "2" ><b><%= AdvertisingLevelName %></b></td>

   </tr>
 <tr >
 <% if len(AdvertisingLevelPrice)> 0 then %>
   <tr>
  	<td class = "body" align = "right" >Price:</td>
  	<td class = "body" > <%= formatcurrency(AdvertisingLevelPrice,2) %></td>
  	</tr>
 <% end if %>
  <% if len(AdvertisingLevelQTYAvailable)> 0 then %>
 <tr>
  	<td class = "body" align = "right" >QTY Available:</td>
  	<td class = "body" ><%= AdvertisingLevelQTYAvailable %></td>
	</tr>
<% end if %>
  <% if len(AdvertisingDimensions)> 0 then %>
	  	 <tr>
  	<td class = "body" align = "right" >Dimensions:</td>
  	<td class = "body" ><%= AdvertisingDimensions %>
	</td>
	</tr>
<% end if %>

  <% if len(AdvertisingLocation)> 0 then %>
<tr>
  	<td class = "body" align = "right" >Location:</td>
  	<td class = "body" ><%= AdvertisingLocation %>
	</td>
	</tr>
<% end if  %>

 <tr>
  	<td class = "body" colspan = "2" ><%=AdvertisingLevelDescription %></td></tr>
</table>
	     </td>
	   </tr>

<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>

<%  end if %>
<br>
 </td>
 <td width = "10">
 <td class = "body" width = "<%=(Textwidth/2) - 10 %>" valign = "top">
 <% if ShowSupporters=True then  %>
 <table border = "0"  cellpadding=0 cellspacing=0 width = "<%=(Textwidth/2) - 10 %>" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><h2>List of Advertisers</h2></td>
	</tr>
	<tr><td class = "body" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 </table>
<% 
 sql = "select *, Business.AddressID as BusinessAddressID from Advertising, Business, Address, AdvertisingLevels,  BusinessTypeLookup, People, Phone, websites where Advertising.BusinessID = Business.BusinessID and Advertising.AddressID = Address.AddressID and Advertising.AdvertisinglevelID = AdvertisingLevels.AdvertisinglevelID and Business.BusinessTypeID = BusinessTypeLookup.BusinessTypeID and People.BusinessId = Business.BusinessID and Business.PhoneID = Phone.PhoneID and Business.BusinessWebsiteID = Websites.WebsitesID and  Advertising.EventID = " & EventID &  " order by BusinessName Desc"
 
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
	Currently there are no Advertisers listed.
	<% else 
	While Not rs.eof  

AdvertisingQTY = rs("AdvertisingQTY")
	AdvertisingID = rs("AdvertisingID")
	BusinessID = rs("BusinessID")
	BusinessAddressID = rs("AddressID")
	AdvertisinglevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelDescription = rs("AdvertisingLevelDescription")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingPaidAmount = rs("AdvertisingPaidAmount")
	AdvertisingPaidAmountMonth  = rs("AdvertisingPaidAmountMonth")
	AdvertisingPaidAmountDay = rs("AdvertisingPaidAmountDay")
	AdvertisingPaidAmountYear = rs("AdvertisingPaidAmountYear")

	AdvertisingLevelPrice = rs("AdvertisingLevelPrice")
	AdvertisingQTY= rs("AdvertisingQTY")
	SpecialRequests= rs("SpecialRequests")
	
	BusinessTypeID = rs("BusinessTypeID")
	BusinessType = rs("BusinessType")
	BusinessName = rs("BusinessName")
	BusinessAddress = rs("AddressStreet")
	BusinessApt = rs("AddressApt")
	BusinessCity = rs("AddressCity")
	BusinessState = rs("AddressState")
	BusinessCountry = rs("Addresscountry")
	BusinessAddressID = rs("BusinessAddressID")
	BusinessEmail = rs("BusinessEmail")	
	BusinessLogo = rs("BusinessLogo")
	BusinessZip = rs("AddressZip")
BusinessHours = rs("BusinessHours")
PeopleFirstName = rs("PeopleFirstName")
PeopleLastName = rs("PeopleLastName")
	BusinessFax = rs("Fax")

	BusinessCell = rs("CellPhone")
	BusinessPhone = rs("Phone")
	BusinessWebsite = rs("Website")
	BusinessWebsiteID=rs("BusinessWebsiteID")
	BusinessPhoneID=rs("PhoneID")
	PeopleID = rs("PeopleID")
	

x = x + 1
%>

	<table border = "0" width = "<%=(Textwidth/2) - 10 %>"  align = "center"  >

<tr>
<td valign = "top" class = "body" align = "center">
<% if len(BusinessName) > 1 then%>
<b><%=BusinessName%></b><br />
<% end if %>
<% if len(BusinessHours) > 1 then%>
Open:&nbsp;<%=BusinessHours%><br />
<% end if %>
<% if len(BusinessWebsite) > 1 then%>
<a href = "http://<%=BusinessWebsite%>" class = "body" target = "blank"><%=BusinessWebsite%></a><br />
<% end if %>
<% if len(BusinessPhone) > 1 then%>
		 <%=BusinessPhone%><br />
<% end if %>
<% if len(BusinessCity) > 1 then%>
<%=BusinessCity%>,
<% end if %> <%=BusinessState%><br /><br />
					
</tr>
</table>

<% rs.movenext
wend %>



<% end if %>
	   	   
	   </td>
</tr>
 		 </tr>
 		</TABLE>
<% end if  %>	   </td>
	 </tr>
	</table>


 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

