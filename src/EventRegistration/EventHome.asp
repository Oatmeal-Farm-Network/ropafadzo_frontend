<%@ Language="VBScript" %> 
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<%  PageName = "Event Home" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

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
	<font size="2"><b><img src = "Images/px.gif" width = "4" height = "1" border = "0" alt = "<%=EventName %> Online Event registration" /><%=EventStartdate %>
<% IF LEN(EventEnddate) > 1 AND not ( EventStartdate = EventEnddate) then%>	
     to <%=EventEnddate %>
 <% END IF  %><br />
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
    <% if EventTypeID = 5 then %>
    <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=DescriptionWidth%>"><tr><td class = "roundedtop" align = "left" >
		<h1>RSVP</h1>
        </td></tr>
        <tr><td class = "roundedBottom">
            <% if len(Session("PeopleID")) > 0 then %>
      
<form  name=form method="post" action="RegisterFreeSingleUser.asp?EventID=<%=EventID%>&PeopleID=<%=PeopleID %>"> 
<table>
            <tr>
            <td class = "body" align = "center" width = "500">
            <b>Service</b>
            </td>
              <td class = "body" align = "center" width = "100">
           <b>Quantity</b>
            </td>
              <td width = "100">
        
            </td>
            </tr>
             <tr>
            <td class = "body" align = "center" width = "500">
            Register to attend
            </td>
              <td class = "body" align = "center" width = "100">
          <select size="1" name="RegisteredQTY">
    				<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>
            </td>
              <td width = "100">
        		<center><input type=submit value="Send RSVP"  class = "regsubmit2" ></center>
            </td>
            </tr>
            </table>
</form>



			<% else %>
			Before you can register for an event you need to <a href = "regcreateSignIn.asp?ReturnFileName=EventHome.asp&ReturnEventID=<%=EventID%>" class = "body">Sign In</a>. Please  <a href = "regcreateSignIn.asp?ReturnFileName=<%=Filename %>&ReturnEventID=<%=EventID%>" class = "body">Sign In</a> or <a href = "SetupAccount.asp?ReturnFileName=EventHome.asp&ReturnEventID=<%=EventID %>" class = "body">create an account.</a>
			<% end if %>
        
                    
        </td>
        </tr>
       </table>
  <br />
  <% end if %>
  
  
  
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

