<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Event Halter" %>
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

<table border = "0"  cellpadding=0 cellspacing=0 width = "<%=textwidth %>" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br><h2>Halter Show</h2></td>
	</tr>
	<tr>
		<td class = "body" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td>
	</tr>
	<tr>
		<td class = "body" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td>
	</tr>
</table>
<% 
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"

'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	ServicesID = rs("ServicesID")
	
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	ServiceStartDate = ServiceStartDateMonth & "/" & ServiceStartDateDay & "/" & ServiceStartDateYear
	dim StartDateDiff
	StartDateDiff = datediff("d", now(), ServiceStartDate)
		
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	ServiceEndDate = ServiceEndDateMonth & "/" & ServiceEndDateDay & "/" & ServiceEndDateYear
	dim EndDateDiff
	EndDateDiff = datediff("d", now(), ServiceEndDate)
	
	Price1Discount= rs("Price1Discount")
	Price1DiscountOther= rs("Price1DiscountOther")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")
    Price1DiscountName = rs("Price1DiscountName")
	
	Price2Discount= rs("Price2Discount")
	Price2DiscountOther= rs("Price2DiscountOther")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")
    Price2DiscountName = rs("Price2DiscountName")

	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountOther= rs("Price3DiscountOther")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")
    Price3DiscountName = rs("Price3DiscountName")
    
	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountOther= rs("Price4DiscountOther")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")
    Price4DiscountName = rs("Price4DiscountName")
    
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
	ElectricityFee = rs("ElectricityFee")
	MaxPensPerFarm = rs("MaxPensPerFarm")
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

%>
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth %>" align = "center">
<tr>
  <td width = "<%=Textwidth  - 320 %>" class = "body" >
  <%= Description%>
  </td>
<td width = "320" valign = "top">

<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "310" align = "center">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header310.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "300" align = "center">	
		<tr>
   			<td class = "body" align = "center" ><h3>Halter Show Rates</H3></td>
		</tr>
	</table>
</td>
</tr>
<tr>
  <td background = "images/background310.jpg">



<table  border = "0" cellpadding=0 cellspacing=0 width = "300"  align = "center" >
	
	<% if len(ServiceStartDateMonth) > 0 or len(ServiceStartDateDay) > 0 or len(ServiceStartDateYear) > 0 then %>
		<% if StartDateDiff > 0 then %>
			<tr>
		      <td class = "smallbody"  colspan = "2" align="center"><b>Registration will not start until&nbsp;<%=ServiceStartDateMonth%>/<%=ServiceStartDateDay%>/<%=ServiceStartDateYear%></b>
		      </td>
			</tr>
		<% end if %>	
		<% if StartDateDiff =< 0 then %>
			<tr>
		      <td class = "smallbody"  colspan = "2" align="center"><b>Registration started:&nbsp;<%=ServiceStartDateMonth%>/<%=ServiceStartDateDay%>/<%=ServiceStartDateYear%></b>
		      </td>
			</tr>
		<% end if %>
	<% end if %>

	<% if len(ServiceEndDateMonth) > 0 or len(ServiceEndDateDay) > 0 or len(ServiceEndDateYear) > 0 then %>
		<% if EndDateDiff < 0 then %>
			<tr>
		      <td class = "smallbody"  colspan = "2" align="center"><b>Registration ended&nbsp;<%=ServiceEndDateMonth%>/<%=ServiceEndDateDay%>/<%=ServiceEndDateYear%></b>
		      </td>
			</tr>
		<% else %>	
			<tr>
		      <td class = "smallbody"  colspan = "2" align="center"><b>Registration ends:&nbsp;<%=ServiceEndDateMonth%>/<%=ServiceEndDateDay%>/<%=ServiceEndDateYear%></b>
		      <br><br></td>
			</tr>
		<% end if %>
	<% end if %>
	
	<% if len(FeePerAnimal) >0  or len(Price4) >0  then  %>
	<tr>
	   <td class = "smallbody"  colspan = "2"><b>Animal Fees and Discounts</b></td>
	</tr>
	<tr><td height = "1" bgcolor = "black" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>
	<tr><td height = "5" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>

	
	<% end if %>
	<% if len(FeePerAnimal) >0 then  %>
	    <tr>
	      <td class = "smallbody" align = "right">Halter classes:</td>
	      <td class = "smallbody" >&nbsp;<%=formatcurrency(FeePerAnimal,2)%> per animal</td>
	    </tr>
	<% End If %>
	    
    <% 
    if len(Price1DiscountEndDate) > 3 and (len(Price1Discount) > 1 or len(Price1DiscountOther) > 1 ) then
    
    If DateDiff("d", Price1DiscountEndDate, Date) > 1 and Price1Discount > 0  Then %>
    	<tr>
    	 	<td class = "smallbody" align="center">&nbsp;<% response.write("The Discount End Date has Past1 " & Price1DiscountEndDate  & "<br>") %></td>
   	 	</tr>
     <% else %>
	   	<tr >
	   		<td class = "smallbody" align = "right" valign = "top">Discount animal fee:</td>
	  		<td class = "smallbody" >&nbsp;<%=formatcurrency(Price1Discount) %><br />(available <%=Price1DiscountStartDate%> to <%=Price1DiscountEndDate%>)</td>
	  	</tr>
  	<% End If 
  	end if %>
	
	<% if len(Price4) >0 then  %>
	    <tr>
	      <td class = "smallbody" align = "right">Production Classes:</td>
	      <td class = "smallbody" >&nbsp;<%=formatcurrency(Price4,2)%> per animal</td>
	    </tr>
	<% End If %>
	
	<%  if len(Price4DiscountEndDate) > 3 and (len(Price4Discount) > 1 or len(Price4DiscountOther) > 1 ) then

	 If DateDiff("d", Price4DiscountEndDate, Date) > 1 and Price4Discount > 0 Then %>
		<tr>
    	 	<td class = "smallbody" align="center">&nbsp;<% response.write("This discount is no longer available.<br>") %></td>
   	 	</tr>

	<% else %>
	  	<tr >
	  		<td class = "smallbody" align = "right">Production Class Discount:</td>
	  	 	<td class = "smallbody" >&nbsp;<%=formatcurrency(Price4Discount) %> per animal <br>(available <%=Price4DiscountStartDate%> to <%=Price4DiscountEndDate%>)
	  	 	</td>
	  	</tr>
	<% End If %>
	<% End If %>
	
<%  if len(FeePerPen) >0  or len(Price2DiscountEndDate) >3 or len(Price3DiscountOther) >1 or len(MaxQTY) > 0  or len(MaxQTY2) > 0   then  %>
   <tr>
	   <td class = "smallbody"  colspan = "2"><br /><b>Pen Fees</b></td>
   </tr>
   	<tr><td height = "1" bgcolor = "black" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>
	<tr><td height = "5" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>

   
  <% end if %>
  
	<% If len(FeePerPen) > 0 then %>
	   <tr>
	      <td class = "smallbody" align = "right">Fee Per Pen:</td>
	      <td class = "smallbody" >&nbsp;<%=formatcurrency(FeePerPen,2)%></td>
		</tr>
	<% End If %>
	
	<%  if len(Price2DiscountEndDate) > 3 then
	If DateDiff("d", Price2DiscountEndDate, Date) > 1 Then %>
		<tr>
    	 	<td class = "smallbody" align="center">&nbsp;This discount has ended.<br></td>
   	 	</tr>
	<% else %>
	  <% if len(Price2DiscountOther) >1 then %>

	    <tr><td class = "smallbody" align = "center" colspan = "2">
	    <% if len(Price2DiscountName) > 0 then %>
	      <B><%=Price2DiscountName %></B><br />
	    <% end if %>
	    
	    &nbsp;<b><%=Price2DiscountOther %></b><br />
	     (available <%=Price2DiscountStartDate%> to <%=Price2DiscountEndDate%>)<br /><br /></td>
		</tr>
	  <% else %> %>	
	
    <tr >
	    <td class = "smallbody" align = "right" valign ="top">Discount:</td>
	    <td class = "smallbody" >&nbsp;<%=formatcurrency(Price2Discount)%><br>(available <%=Price2DiscountStartDate%> to <%=Price2DiscountEndDate%>)</td>
		</tr>
    <%
      end if
     End If 
    end if %>

	<% if len(MaxQTY) >0 then  %>
		<tr>
		    <td class = "smallbody" align = "right">Max. # <b>Juveniles</b> per pen:</td>
		    <td class = "smallbody" >&nbsp;<%=MaxQTY%></td>
	<tr>
	<% end if %>
	
	<% if len(MaxQTY2) >0 then  %>
		<tr>
		    <td class = "smallbody" align = "right">Max. # <b>Adults</b> per pen:</td>
		    <td class = "smallbody" >&nbsp;<%=MaxQTY2%></td>
		<tr>
	   	<% end if %>
	   		<% If len(MaxPensPerFarm) > 0 Then %> 
	    <tr >
		    <td class = "smallbody" align = "right">Max. # Pens Per Exhibitor:</td>
			<td class = "smallbody" >&nbsp;<%=MaxPensPerFarm%></td>
		</tr>
	<% End If %>
	
	   	
	<% if len(price3) >0  or len(Price3Discount) >0  then  %>
		<% if price3 > 0 then  %>
 	<tr>
		   <td class = "smallbody"  colspan = "2" height = "25"><b>Display Stall Fees</b></td>
	</tr>
		   	<tr><td height = "1" bgcolor = "black" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>
	<tr><td height = "5" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>
	
	<% if len(price3) > 0 then %>
		<tr>
		      <td class = "smallbody" align = "right">Fee Per Display Stall:</td>
		      <td class = "smallbody" >&nbsp;<%=formatcurrency(Price3,2)%></td>
		</tr>
	

	<% end if %>
	
	<% if len(price3Discount) > 0 then %>
		<% if price3Discount > 0 then %>
		<tr>
		      <td class = "smallbody" align = "right">Display Stall Discount:</td>
		      <td class = "smallbody" >&nbsp;<%=formatcurrency(Price3Discount,2)%></td>
		</tr>
	<% end if %>
		<% end if %>
	<%  if len(Price2DiscountEndDate) > 3 then
		If DateDiff("d", Price2DiscountEndDate, Date) > 1 Then %>
		<tr>
    	 	<td class = "smallbody" align="center">&nbsp;<% response.write("Dispay Stall Discount End Date has Past = " & Price3DiscountEndDate & "<br>") %></td>
   	 	</tr>
	<%else %>
    	<tr >
		    <td class = "smallbody" align = "right">Display Stall Discount:</td>
		     <td class = "smallbody" >&nbsp;<%=formatcurrency(Price3Discount) %> (available <%=Price3DiscountStartDate%> to <%=Price3DiscountEndDate%>)</td>
		</tr>
	<% End If 
	end if %>
<% end if %>	
	
<% if len(VetCheckFee) >0  or len(ElectricityFee) >0  or  len(StallMatPrice) >0 then  %>
<% if VetCheckFee >0  or ElectricityFee >0  or  StallMatPrice >0 then  %>
 	<tr>
		<td class = "smallbody"  colspan = "2"><b>Other Fees</b></td>
	</tr>
	   	<tr><td height = "1" bgcolor = "black" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>
	<tr><td height = "5" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td></tr>

<% end if %>
<% end if %>

	<% If Len(VetCheckFee) > 0 then %>
		<% If VetCheckFee > 0 then %>
		<tr>
		      <td class = "smallbody" align = "right">Vet Check Fee:</td>
		      <td class = "smallbody" >&nbsp;<%=formatcurrency(VetCheckFee,2)%></td>
		</tr>
	<% end if %>
	<% end if %>
	
	<% if len(ElectricityFee) > 0 then %>
		<% if ElectricityFee > 0 then %>
		<tr>
		      <td class = "smallbody" align = "right">Electricity Fee:</td>
		      <td class = "smallbody" >&nbsp;<%=formatcurrency(ElectricityFee,2)%></td>
		</tr>
	<% end if %>
	<% end if %>
		

	
	<% if len(StallMatPrice) > 0 then %>
		<% if StallMatPrice > 0 then %>
		<tr>
		      <td class = "smallbody" align = "right">Stall Mats Are Offered at:</td>
		      <td class = "smallbody" >&nbsp;<%=formatcurrency(StallMatPrice,2)%></td>
		</tr>
	<% end if %>
	<% end if %>

	<% end if %>
	
	

		<tr>
		      <td class = "smallbody" align = "center" colspan = "2"><br />	<a href = "EventRegister.asp?EventID=<%=EventID%>" class = "body">Register Now!</a></td>
		</tr>

	

	
</table>
<tr>
  <td background = "images/Footer310.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>
</td>
</tr>
</table>



<br><br>
 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

