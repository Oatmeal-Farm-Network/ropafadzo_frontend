<%@ Language="VBScript" %> 
<!DOCTYPE html>
<html>
<head>

<%  PageName = "Vendors" %>
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
		<h1><%=EventName %> Vendors</h1>
        </td></tr>
        <tr><td class = "roundedBottom">
        

<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=Textwidth %>" align = "center" >
<tr><td class= "body" valign = "top" >
<% 

sql = "select Description, ShowSupporters  from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Vendors' and EventID =  " & EventID & " Order by ServicesID Desc"
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

</td>
</tr>
</table>


<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=Textwidth %>" align = "center" >
	<tr>
	   <td width = "<%=Textwidth / 2 %>" valign = "top">
<table border = "0" cellpadding=0 cellspacing=0 width = "<%=Textwidth / 2 %>" align = "center">
	<tr>
		<td Class = "body"><H2>Vendor Options </H2>
		</td>
	</tr>
		<tr><td class = "Menu2" colspan  "3" bgcolor = "#abacab" height = "1"></td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
 sql = "select * from VendorLevels  where EventID = " & EventID 
 
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "<%=Textwidth / 2 %>" align = "center">
	
	<%
	order = "odd"
	While Not rs.eof  
VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	VendorStallDescription = rs("VendorStallDescription")
	VendorStallPrice= rs("VendorStallPrice")
	VendorStallQTYAvailable = rs("VendorStallQTYAvailable")
	VendorStallPower = rs("VendorStallPower")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	Numfreetables = rs("Numfreetables")
Costpertable=  rs("Costpertable")
MaxExtraTables = rs("MaxExtraTables")
	%>

		<tr>
	     <td class="body" align = "left" >
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=3 cellspacing=0  align = "left" width = "<%=Textwidth /2 %>">
 <tr>
  	<td class = "body" colspan = "2" ><h2><%= VendorStallName %></h2></td>

   </tr>
 <tr >
 <% if len(VendorStallPrice)> 0 then %>
   <tr>
  	<td class = "body" align = "right" width = "200">Price:</td>
  	<td class = "body" ><img src = "images/px.gif" width = "3" height = "1" /><%= formatcurrency(VendorStallPrice,2) %></td>
  	</tr>
 <% end if %>
  <% if len(VendorStallQTYAvailable)> 0 then %>
 <tr>
  	<td class = "body" align = "right" >QTY Available:</td>
  	<td class = "body" ><img src = "images/px.gif" width = "3" height = "1" /><%= VendorStallQTYAvailable %></td>
	</tr>
<% end if %>
  <% if len(VendorStallMaxQtyPer)> 0 then %>
	  	 <tr>
  	<td class = "body" align = "right" >Max QTY Per Vendor:</td>
  	<td class = "body" ><img src = "images/px.gif" width = "3" height = "1" /><%= VendorStallMaxQtyPer %>
	</td>
	</tr>
<% end if %>
	<tr>
	  <td class = "body" align = "right" >Power Available?:</td>
  		<td class = "body" width = "<%=(Textwidth /2) - 160 %>" >
  		<img src = "images/px.gif" width = "3" height = "1" /><% if VendorStallPower = True then %>
		Yes
		<% else %>
		No
		<% end if %>
		</td>
	</tr>
  <% if len(Numfreetables)> 0 then %>
<tr>
  	<td class = "body" align = "right" >Comes with:</td>
  	<td class = "body" ><img src = "images/px.gif" width = "3" height = "1" /><%= Numfreetables %> tables.
	</td>
	</tr>
<% end if  %>

  <% if len(Costpertable)> 0 then %>
<tr>
  	<td class = "body" align = "right" >Cost Per Extra Table:</td>
  	<td class = "body"><img src = "images/px.gif" width = "3" height = "1" /><%= formatcurrency(Costpertable, 2) %>
</td>
  	</tr>
 <% end if %>
   <% if len(MaxExtraTables)> 0 then %>
      <% if MaxExtraTables> 0 then %>
<tr>
  	<td class = "body" align = "right"  >Max. No. Extra Tables:</td>
  	<td class = "body" ><img src = "images/px.gif" width = "3" height = "1" /><%= MaxExtraTables %>
</td>
  	</tr>
  	 <% end if  %>
 <% end if  %>
 <tr>
  	<td class = "body" colspan = "2" ><%=VendorStallDescription %><br /><br /></td></tr>
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
	   <td  valign = "top"   colspan = "3"><h2>List of Vendors</h2></td>
	</tr>
	<tr><td class = "body" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 </table>
<%  sql = "select * from Registration where EventID = " & EventID & " and instr(ServiceDescription , 'vendor') and Quantity > 0 order by ItemPrice desc"

    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql, conn, 3, 3   
	while not rs2.eof  
	VendorWebsitesID = ""
	  VendorPeopleID = rs2("PeopleID")

	
sql = "select * from People where PeopleID = " & VendorPeopleID 

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not  rs.eof then 
	While Not rs.eof  

PeopleFirstName = rs("PeopleFirstName")
PeopleLastName = rs("PeopleLastName")
PeoplePhone= rs("PeoplePhone")
PeopleCell= rs("PeopleCell")
PeopleFax= rs("Peoplefax")
'VendorQTYExtraTables = rs("VendorQTYExtraTables")
	'VendorID = rs("VendorID")
	VendorBusinessID  = rs("BusinessID")
	BusinessID  = rs("BusinessID")
	VendorAddressID = rs("AddressID")
	VendorWebsitesID = rs("WebsitesID")
	if len(VendorWebsitesID) > 0 then
	else
	VendorWebsitesID = 0
	end if
	'response.Write("VendorWebsitesID =" & VendorWebsitesID  )
	'VendorStallName = rs("VendorStallName")
	'VendorStallDescription = rs("VendorStallDescription")
	'VendorStallName = rs("VendorStallName")
	'VendorPaidAmount = rs("VendorPaidAmount")
	'VendorPaidAmountMonth  = rs("VendorPaidAmountMonth")
	'VendorPaidAmountDay = rs("VendorPaidAmountDay")
	'VendorPaidAmountYear = rs("VendorPaidAmountYear")

	'VendorStallPrice = rs("VendorStallPrice")
	'VendorBoothQTY= rs("VendorBoothQTY")
	'SpecialRequests= rs("SpecialRequests")
	
Businessname = ""
BusinessLogo = ""
	'PeopleID = rs("PeopleID")
if len(BusinessID) > 0 then	
sql3 = "select * from Business  where BusinessID = " & VendorBusinessID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	BusinessName = rs3("BusinessName")
BusinessLogo = rs3("BusinessLogo")

if len(BusinessLogo) > 6 then
str1 = lcase(BusinessLogo)
str2 = "http"
str3 = "uploads"
If not InStr(str1,str2) > 0 and not InStr(str1,str3) > 0 Then
	BusinessLogo= "http://www.AlpacaInfinity.com/uploads/" & BusinessLogo
End If 
end if

end if 	
rs3.close
end if	

BusinessAddress = ""
	BusinessApt = ""
	BusinessCity = ""
	BusinessState = ""
	BusinessCountry = ""
BusinessZip =""

if len(VendorAddressID) > 0 then	
sql3 = "select * from Address where AddressID = " & VendorAddressID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	BusinessAddress = rs3("AddressStreet")
		BusinessAddressApt = rs3("AddressApt")
	BusinessApt = rs3("AddressApt")
	BusinessCity = rs3("AddressCity")
	BusinessState = rs3("AddressState")
	BusinessCountry = rs3("Addresscountry")
BusinessZip = rs3("AddressZip")
end if 	
rs3.close
end if	


Website =""
if len(VendorWebsitesID) > 0 then	
if VendorWebsitesID > 0 and (not (VendorwebsitesID = 174) or BusinessName ="BillyGoat Mountain Ranch") then	
sql3 = "select * from Websites where WebsitesID = " & VendorWebsitesID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	Website = rs3("Website")
    end if 	
rs3.close
end if	
end if	
x = x + 1
%>

	<table border = "0" width = "400"  align = "center"  >

<tr>
<td width = "120" align = "center" valign = "top">
<% if len(businessLogo)> 2 then %>
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
<% if len(Website) > 1 and len(Website)< 35 then%>
<a href = "http://<%=Website%>" class = "body" target = "blank"><%=Website%></a><br />
<% end if %>
<% if len(Website) > 1 and len(Website)> 34 then%>
<a href = "http://<%=Website%>" class = "body" target = "blank"><%=left(Website, 30)%>...</a><br />
<% end if %>

<% if len(BusinessAddress) > 1 then%>
<%=BusinessAddress%><br />
<% end if %>
<% if len(BusinessAddressApt) > 1 then%>
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
<% end if %><br />
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
	   	   
	
<% end if  %>





	   </td>
</tr>
 		</TABLE>   	   
	   </td>
</tr>
 		</TABLE>

	   </td>
	 </tr>
	</table>


 <!--#Include file="EventFooter.asp"--> 

</body>
</html>

