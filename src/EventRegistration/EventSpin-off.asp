<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Event Spin-off" %>
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
	   <td  valign = "top"   colspan = "3"><br><h2>Spin-Off</h2></td>
	</tr>
	<tr><td class = "body" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 <tr>
</table>



<% 
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'SpinOff' and EventID =  " & EventID & " Order by ServicesID Desc"

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3

dim StartDateDiff
dim EndDateDiff  
 
If Not rs.eof Then
	EventTypeID = rs("EventTypeID")
	
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	'response.write("ServiceStartDateMonth is " & ServiceStartDateMonth & "<br>")
	
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	'response.write("ServiceStartDateDay is " & ServiceStartDateDay & "<br>")
	
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	'response.write("ServiceStartDateYear is " & ServiceStartDateYear & "<br>")

	if (ServiceStartDateMonth > 0) and (ServiceStartDateDay > 0) and (ServiceStartDateYear > 0) then
		ServiceStartDate = ServiceStartDateMonth & "/" & ServiceStartDateDay & "/" & ServiceStartDateYear
		StartDateDiff = datediff("d", now(), ServiceStartDate)
	end if

	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	if (ServiceEndDateMonth > 0) and (ServiceEndDateDay > 0) and (ServiceEndDateYear > 0) then
		ServiceEndDate = ServiceEndDateMonth & "/" & ServiceEndDateDay & "/" & ServiceEndDateYear
		EndDateDiff = datediff("d", now(), ServiceEndDate)
	end if
	
	FeePerFleece = rs("Price")
	
	FeePerSPEntry = rs("Price")
	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
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

Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear
%>



<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth %>" align = "center">
<tr>
  <td width = "<%=Textwidth  - 320 %>" class = "body" >
  <%= Description%>
  </td>
<td width = "320" valign = "top">

<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "310" align = "center" ">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header310.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "300" align = "center">	
		<tr>
   			<td class = "body" align = "center" ><h3>Spin-Off Fees & Dates</H3></td>
		</tr>
	</table>
</td>
</tr>
<tr>
    <td background = "images/background310.jpg" bgcolor = "#FFFDFF">

<table  border = "0" cellpadding=0 cellspacing=0 width = "300"  align = "center" >
<tr><td colspan = "2" height = "5">&nbsp;</td></tr>
  <% if len(ServiceStartDateMonth) > 0 or len(ServiceStartDateDay) > 0 or len(ServiceStartDateYear) > 0 then %>
		<tr>
	      <td class = "smallbody"  colspan = "2" align="center"><b>Registration Starts:&nbsp;<%=ServiceStartDateMonth%>/<%=ServiceStartDateDay%>/<%=ServiceStartDateYear%></b>
	      </td>
		</tr>
	<% end if %>

	<% if len(ServiceEndDateMonth) > 0 or len(ServiceEndDateDay) > 0 or len(ServiceEndDateYear) > 0 then %>
		<tr>
	      <td class = "smallbody"  colspan = "2" align="center"><b>Registration Ends:&nbsp;<%=ServiceEndDateMonth%>/<%=ServiceEndDateDay%>/<%=ServiceEndDateYear%></b>
	      <br><br></td>
		</tr>
	<% end if %>
	
	<% if len(FeePerSPEntry) > 0   then  %>
	<% 'if len(FeePerSPEntry) > 0  or len(Price4) >0  then  %>


		<tr>
		   <td class = "smallbody"  colspan = "2"><h3>Spin-Off Fees and Dates</h3></td>
		</tr>
		<tr>
			<td height = "1" bgcolor = "black" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td>
		</tr>
		<tr>
			<td height = "5" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td>
		</tr>
	<% end if %>
	
	<% if len(FeePerSPEntry) >0 then  %>
	    <tr>
	      <td class = "smallbody" align = "right">Fee per Spin-Off entry:</td>
	      <td class = "smallbody" >&nbsp;<%=formatcurrency(FeePerSPEntry,2) %></td>
	    </tr>
	<% End If %>
	    
    <% if len(Price1DiscountEndDate) > 3 then
    	If DateDiff("d", Price1DiscountEndDate, Date) > 1 Then %>
	    	<tr>
	    	 	<td class = "smallbody" align="center">&nbsp;<% response.write("The Discount End Date has Past = " & Price1DiscountEndDate & "<br>") %></td>
	   	 	</tr>
     	<% else %>
		   	<tr >
		   		<td class = "smallbody" align = "right">Discount Fee Spin-Off entry:</td>
		  		<td class = "smallbody" >&nbsp;<%=formatcurrency(Price1Discount) %> (available <%=Price1DiscountStartDate%> to <%=Price1DiscountEndDate%>)</td>
		  	</tr>
  		<% End If 
  	end if %>
  
  


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

