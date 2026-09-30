<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<style type="text/css">
	
	#dhtmlgoodies_tooltip{
		background-color:white;
		border:1px solid #000;
		position:absolute;
		display:none;
		z-index:20000;
		padding:2px;
		font-size:0.9em;
		-moz-border-radius:6px;	/* Rounded edges in Firefox */
		font-family: "Trebuchet MS", "Lucida Sans Unicode", Arial, sans-serif;
		
	}
	#dhtmlgoodies_tooltipShadow{
		position:absolute;
		background-color:white;
		display:none;
		z-index:10000;
		opacity:0.7;
		filter:alpha(opacity=70);
		-khtml-opacity: 0.7;
		-moz-opacity: 0.7;
		-moz-border-radius:6px;	/* Rounded edges in Firefox */
	}
	

		H1 {font: 16pt arial; font-weight:  bold ;   color: black ; text-align: center; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: 36px; PADDING-TOP: 0px; }
		H2 {font: 12pt arial;  font-weight:  bold ;  color: black; text-align: center; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: 26px; PADDING-TOP: 0px; }
		.BodyText {font: 10pt arial; font-weight:  normal ;   color: black; PADDING-RIGHT: 0px; PADDING-LEFT: 5px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: 16px; PADDING-TOP: 0px;  }

</style>


	<SCRIPT type="text/javascript">
	var dhtmlgoodies_tooltip = false;
	var dhtmlgoodies_tooltipShadow = false;
	var dhtmlgoodies_shadowSize = 4;
	var dhtmlgoodies_tooltipMaxWidth = 700;
	var dhtmlgoodies_tooltipMinWidth = 100;
	var dhtmlgoodies_iframe = false;
	var tooltip_is_msie = (navigator.userAgent.indexOf('MSIE')>=0 && navigator.userAgent.indexOf('opera')==-1 && document.all)?true:false;
	function showTooltip(e,tooltipTxt)
	{
		
		var bodyWidth = Math.max(document.body.clientWidth,document.documentElement.clientWidth) - 20;
	
		if(!dhtmlgoodies_tooltip){
			dhtmlgoodies_tooltip = document.createElement('DIV');
			dhtmlgoodies_tooltip.id = 'dhtmlgoodies_tooltip';
			dhtmlgoodies_tooltipShadow = document.createElement('DIV');
			dhtmlgoodies_tooltipShadow.id = 'dhtmlgoodies_tooltipShadow';
			
			document.body.appendChild(dhtmlgoodies_tooltip);
			document.body.appendChild(dhtmlgoodies_tooltipShadow);	
			
			if(tooltip_is_msie){
				dhtmlgoodies_iframe = document.createElement('IFRAME');
				dhtmlgoodies_iframe.frameborder='5';
				dhtmlgoodies_iframe.style.backgroundColor='#FFFFFF';
				dhtmlgoodies_iframe.src = '#'; 	
				dhtmlgoodies_iframe.style.zIndex = 100;
				dhtmlgoodies_iframe.style.position = 'absolute';
				document.body.appendChild(dhtmlgoodies_iframe);
			}
			
		}
		
		dhtmlgoodies_tooltip.style.display='block';
		dhtmlgoodies_tooltipShadow.style.display='block';
		if(tooltip_is_msie)dhtmlgoodies_iframe.style.display='block';
		
		var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
		if(navigator.userAgent.toLowerCase().indexOf('safari')>=0)st=0; 
		var leftPos = e.clientX + 10;
		
		dhtmlgoodies_tooltip.style.width = null;	// Reset style width if it's set 
		dhtmlgoodies_tooltip.innerHTML = tooltipTxt;
		dhtmlgoodies_tooltip.style.left = leftPos + 'px';
		dhtmlgoodies_tooltip.style.top = e.clientY + 10 + st + 'px';

		
		dhtmlgoodies_tooltipShadow.style.left =  leftPos + dhtmlgoodies_shadowSize + 'px';
		dhtmlgoodies_tooltipShadow.style.top = e.clientY + 10 + st + dhtmlgoodies_shadowSize + 'px';
		
		if(dhtmlgoodies_tooltip.offsetWidth>dhtmlgoodies_tooltipMaxWidth){	/* Exceeding max width of tooltip ? */
			dhtmlgoodies_tooltip.style.width = dhtmlgoodies_tooltipMaxWidth + 'px';
		}
		
		var tooltipWidth = dhtmlgoodies_tooltip.offsetWidth;		
		if(tooltipWidth<dhtmlgoodies_tooltipMinWidth)tooltipWidth = dhtmlgoodies_tooltipMinWidth;
		
		
		dhtmlgoodies_tooltip.style.width = tooltipWidth + 'px';
		dhtmlgoodies_tooltipShadow.style.width = dhtmlgoodies_tooltip.offsetWidth + 'px';
		dhtmlgoodies_tooltipShadow.style.height = dhtmlgoodies_tooltip.offsetHeight + 'px';		
		
		if((leftPos + tooltipWidth)>bodyWidth){
			dhtmlgoodies_tooltip.style.left = (dhtmlgoodies_tooltipShadow.style.left.replace('px','') - ((leftPos + tooltipWidth)-bodyWidth)) + 'px';
			dhtmlgoodies_tooltipShadow.style.left = (dhtmlgoodies_tooltipShadow.style.left.replace('px','') - ((leftPos + tooltipWidth)-bodyWidth) + dhtmlgoodies_shadowSize) + 'px';
		}
		
		if(tooltip_is_msie){
			dhtmlgoodies_iframe.style.left = dhtmlgoodies_tooltip.style.left;
			dhtmlgoodies_iframe.style.top = dhtmlgoodies_tooltip.style.top;
			dhtmlgoodies_iframe.style.width = dhtmlgoodies_tooltip.offsetWidth + 'px';
			dhtmlgoodies_iframe.style.height = dhtmlgoodies_tooltip.offsetHeight + 'px';
		
		}
				
	}
	
	function hideTooltip()
	{
		dhtmlgoodies_tooltip.style.display='none';
		dhtmlgoodies_tooltipShadow.style.display='none';		
		if(tooltip_is_msie)dhtmlgoodies_iframe.style.display='none';		
	}
	
	</SCRIPT>
<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<%
EventID = request.querystring("EventID")

if len(EventID) < 1 then 	
	Session("EventID") =  EventID
end if 

response.write(" 1 EventID = " & EventID & "<br>")

PeopleID = request.querystring("PeopleID")
if len(PeopleID) < 1 then 
Session("PeopleID") = PeopleID
end if 
'response.write("PeopleID=" & peopleID)

EventSubTypeID = request.querystring("EventSubTypeID")

response.write("EventID = " & EventID & "<br>")
sql3 = "select * from Services where EventID = " & EventID
response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  ServiceTypeLookupID = rs3("ServiceTypeLookupID")
end if



 sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID
response.write(sql3)
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
%>
<br>

<h1><%=EventName%></h1>
<form action= 'RegConfirmation.asp' method = "post">


<% if  ShowHalterShow = True  then  %>

	
<% end if %>


	
<% if  ShowFleeceShow = True  then %>
  

<% end if %>


<% 
response.write("ShowVendors=" & ShowVendors )


if ShowVendors = True  then %>

<table border = "0" width = "900"  align = "center"  >
<tr>
<td valign = "top">


<% 
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Vendors' and EventID =  " & EventID & " Order by services.ServiceTypeLookupID "
response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	ServiceEndDate = rs("ServiceEndDateMonth") & "/" & rs("ServiceEndDateDay") & "/" & rs("ServiceEndDateYear")
	maxQTY2 =  rs("ServiceMaxQuantity")
	if len(MaxQTY2) > 0 then
	  MaxQTY = "checked"
	end if

	
response.write("maxQTY2=' & maxQTY2 )	
	
	Description =  rs("Description")


str1 = Description
str2 = vbCrLf
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 ,"<br>" )
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

if MaxDate = "True" and ServiceEndDate < FormatDateTime(Date) then

else

row = "odd"
rowcount = 1

sql = "select * from VendorLevels  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>

<table width = "900" border = "1"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Vendor Options</h2>
</td>
</tr>
<tr>
<td>
<table border = "0" width = "600"  align = "center" >
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
	VendorStallDescription = rs("VendorStallDescription")
	VendorStallPrice= rs("VendorStallPrice")
	VendorStallQTYAvailable = rs("VendorStallQTYAvailable")
	VendorStallPower = rs("VendorStallPower")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	

 str1 = VendorStallDescription
 str2 = vblf
If InStr(str1,str2) > 0 Then
	VendorStallDescription= Replace(str1, str2 , "")
End If  

str1 = VendorStallDescription
str2 = vbtab
If InStr(str1,str2) > 0 Then
	VendorStallDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = VendorStallDescription
str2 = vbcrlf
If InStr(str1,str2) > 0 Then
	VendorStallDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = VendorStallDescription
str2 = vbcr
If InStr(str1,str2) > 0 Then
	VendorStallDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = VendorStallDescription
str2 = vblf
If InStr(str1,str2) > 0 Then
	VendorStallDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If 

str1 = VendorStallDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	VendorStallDescription= Replace(str1, str2 , "")
End If 

Mouseovertext = Cstr(VendorStallDescription)


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


'response.write("VendorStallMaxQtyPer=" & VendorStallMaxQtyPer)
'response.write("VendorStallQTYAvailable=" & VendorStallQTYAvailable)
'response.write("MaxCount=" & MaxCount)



if VendorStallQTYAvailable = 0 then %>

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
<td class = "body2" width = "350"><a href="#" class = "body2" onmouseout="hideTooltip()" onmouseover="showTooltip(event, '<%= Mouseovertext %>' );return false"><b><%= VendorStallName %></b></a>	
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

</td>
</table>
</td>
<td class = "body2" width = "400" valign = "top"><% if ServiceEndDate < FormatDateTime(Date) and len(ServiceEndDate) > 4 then %>
<B>Registration ends: <%=ServiceEndDate%></b><br>
<% end if %>
<%= Description %>
</tr></table>



<% end if %>


<% end if %>

<input type="hidden" name="vendorrowcount" value="<%=vendorrowcount%>"  >

<% end if %>
















 <% if ShowSponsors = True  then %>


<table width = "900" border = "1"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
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
</table>
</td>
<td class = "body2" width = "400" valign = "top"><% if ServiceEndDate < FormatDateTime(Date) and len(ServiceEndDate) > 4 then %>
<B>Registration ends: <%=ServiceEndDate%></b><br>
<% end if %>
<%= Description %>&nbsp;
</tr></table>



<% end if %>


<% end if %>

<input type="hidden" name="sponsorshiprowcount" value="<%=sponsorshiprowcount%>"  >

<% end if %>












 <% if ShowClasses = True  then %>



<% end if %>

<TABLE width = "900">
<tr>
	<td  align = "center" colspan = "2">
	<input type="hidden" name="PeopleID" value="<%=PeopleID%>"  >
	<input type="hidden" name="EventID" value="<%=EventID%>"  >
	<input type="hidden" name="EventSubTypeID" value="<%=EventSubTypeID%>"  >
		<input type=submit value="Sign Up "  STYLE="color: white;  font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #990000;" size ="100">
		</td>
</tr>
</table>




		<!--#Include file="Footer.asp"-->
		
		</Body>
</HTML>

