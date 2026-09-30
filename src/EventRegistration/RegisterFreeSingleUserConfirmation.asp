<%@ Language=VBScript %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<HEAD>

 
<%  PageName = "Event Home" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

<meta http-equiv="Content-Language" content="en-us">


<title>Single User Registration</title>
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

  sql = "select * from EventPageLayout where PageName = 'Event Home' and EventID=" & EventID
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        PageLayoutID = rs("PageLayoutID")
      end if
  rs.close  
  
  
 sql = "select * from EventPageLayout2 where BlockNum = 1 and PageLayoutID = " & PageLayoutID & ";"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        EventDescription = rs("PageText")
      end if
  rs.close  
   
  %>

<table width = "960"><tr>
 
<% DescriptionWidth = 960 
if len(EventImage) > 4 or len(EventLocationStreet) > 1 or len(EventLocationCity) > 1 then
    DescriptionWidth = 700
end if 
%>
<% if  len(EventImage) > 4 or len(EventLocationStreet) > 1 or len(EventLocationCity) > 1 then %>
<td valign = "top">
<% if  len(EventImage) > 4 then %>
 <table border = "0" cellspacing="0" cellpadding = "0" align = "center" ><tr><td class = "roundedtopandbottom" align = "left" >
<img src = "<% = EventImage %>" width = "250" border = "0"/> 
</td>
</tr>
</table>
     <% end if %>
  <% if len(EventLocationStreet) > 1 or len(EventLocationCity) > 1 then %>
  <br />
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
           <% end if %>


</td>
<% end if %>
<td valign = "top">
<table border = "0" width = "<%=DescriptionWidth%>">
<tr>
  <td valign = "top" width = "<%=DescriptionWidth%>"><br>
  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=DescriptionWidth%>"><tr><td class = "roundedtop" align = "left" >
		<h1>RSVP Confirmation</h1>
        </td></tr>
        <tr><td class = "roundedBottom">
          <div align = "left" class = "body"><b>Thank you for your RSVP.</b></div>
  



 </td>
        </tr>
       </table>
		
        </td>
        </tr>
       </table>
  <br />

  
  
  
  <% if len( EventDescription) > 1 then %>
           <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=DescriptionWidth%>"><tr><td class = "roundedtop" align = "left" >
		<h1><%=EventName %></h1>
        </td></tr>
        <tr><td class = "roundedBottom">
          <div align = "left" class = "body"><% = EventDescription %></div>
        
        </td>
        </tr>
       </table>
<% end if %>
       </td>
   </tr>
 </table>
    </td>
   </tr>
 </table>
<br /><br />



 <!--#Include file="EventFooter.asp"--> 
</body>
</html>

