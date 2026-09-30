<%@ Language=VBScript %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<HEAD>
<title>Single User Registration</title>
       <link rel="stylesheet" type="text/css" href="/style.css">
       <!--#Include virtual="GlobalVariables.asp"-->
</HEAD>
<BODY>
 <!--#Include file="EventHeader.asp"--> 
<%
EventID = request.QueryString("EventID")
PeopleID = request.QueryString("PeopleID")
RegisteredQTY = request.Form("RegisteredQTY")

'response.write("EventID=" & EventID )
'response.write("PeopleID=" & PeopleID )
'response.write("RegisteredQTY=" & RegisteredQTY )

sql2 = "select * from People where PeopleID = " & PeopleID 


    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		PeopleFirstName=rs2("PeopleFirstName")
		PeopleLastName=rs2("PeopleLastName")
		PeopleEmail=rs2("PeopleEmail")
        BusinessID= rs2("BusinessID")
        AddressID= rs2("AddressID")
   end if 

  rs2.close

if len(BusinessID) > 0 then
sql2 = "select * from Business where BusinessID = " & BusinessID

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		BusinessName=rs2("BusinessName")  
   end if 

  rs2.close
end if 


if len(AddressID) > 0 then
sql2 = "select * from Address where AddressID = " & AddressID

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		AddressStreet=rs2("AddressStreet") 
		AddressApt=rs2("AddressApt")
		AddressCity=rs2("AddressCity")  
		AddressState=rs2("AddressState")    
		AddressZip=rs2("AddressZip") 
		AddressCountry=rs2("AddressCountry")    
   end if 

  rs2.close
end if 






	Query =  "INSERT INTO Registration(Status, EventID, PeopleID, Quantity, ServiceDescription, RegistrationDateTime )" 
	Query =  Query & " Values ('Paid', " & EventID  & ", " & PeopleID  &  ", " &  RegisteredQTY  &  ", 'General Registration'," & "'" & Now & "' )" 
		
Conn.Execute(Query) 

	Query =  "INSERT INTO RegistrationTemp(Status, EventID, PeopleID, Quantity, ServiceDescription, RegistrationDateTime )" 
	Query =  Query & " Values ('Paid', " & EventID  & ", " & PeopleID  &  ", " &  RegisteredQTY  &  ", 'General Registration'," & "'" & Now & "' )" 
		
Conn.Execute(Query) 


	Query =  "INSERT INTO OrderssetupEvents (Payment_status, EventID, PeopleID, Payer_email, address_city, address_country , address_name,  address_state, address_street, address_postcode, first_name, last_name, DateAdded)"
Query =  Query & " Values ('Completed', " & EventID  & ", " & PeopleID  &  ", '" &  PeopleEmail  &  "', '" & AddressCity &  "' , '" & AddressCountry &  "', '" & Owners &  "' , '" & AddressState &  "' , '" & AddressStreet &  "' , '" & AddressZip &  "' , '" & PeopleFirstName &  "' , '" & PeoplelastName & "' ,'" & Now & "' )" 
		
Conn.Execute(Query) 


 %>
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
  <td valign = "top" width = "<%=DescriptionWidth%>">
    <% if EventTypeID = 5 then %>
    <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=DescriptionWidth%>"><tr><td class = "roundedtop" align = "left" >
		<h1>RSVP</h1>
        </td></tr>
        <tr><td class = "roundedBottom">
        <b>Thank you for your registration.</b>
                    
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

</BODY>
</HTML>
