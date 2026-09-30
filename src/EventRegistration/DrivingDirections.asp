<%@ Language="VBScript" %> 
<!DOCTYPE html>
<html>
<head>

<%  PageName = "Driving Directions" %>
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
	<br />

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" ><tr><td class = "roundedtop" align = "left" >
		<h1><%=EventName %> Driving Directions</h1>
        </td></tr>
        <tr><td class = "roundedBottom">	
        
        <table width = "960"><tr><td valign = "top">				 
<table border = "0" cellpadding=0 cellspacing=0  align = "center" >
	<tr>
		<td class = "body" width= "700" valign = "top">	
			<% bodywidth = 700 %>
			<!--#Include file="BodyTextInclude.asp"--> 
			<br><br>
	
</td>	
<td>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "260"><tr><td class = "roundedtopandbottom" align = "left" >
 <br />
      <font size="4"><%=EventName %></font><br />
	<font size="2"><b><img src = "Images/px.gif" width = "4" height = "1" border = "0" alt = "<%=EventName %> Online Event registration" /><%=EventStartdate %> to <%=EventEnddate %><br />
<br />

   <% if len(EventLocationName) > 1 then %>
   <b><%=EventLocationName  %></b><br />
   <% end if %>
   <%=EventLocationStreet  %> &nbsp;<%=EventLocationApt %>&nbsp;<br />
		<%=EventLocationCity  %>&nbsp;
		<%=EventLocationState  %>&nbsp;
		<%=EventLocationZip %>&nbsp;
		<%=EventLocationCountry %>&nbsp;</font><br />
		
		<% if len(EventLocationStreet) > 1 and   len(EventLocationCity) > 1 and len(EventLocationState) > 1 then %>
        <iframe src ="EventMapFrame.asp?EventID=<%=EventID %>" width="200" height="320" align = "center" frameborder = "0" scrolling = "no" style="background-color:white">
        </iframe>
        <% end if %>
        </td>
        </tr>
       </table>
 

</td>
</tr>
</table>
<br /><br />
		</td>
	</tr>
</table>
</td>
	</tr>
</table>
 <!--#Include file="EventFooter.asp"--> 
</body>
</html>

