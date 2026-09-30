<% EventID = request.querystring("EventID")

if len(EventID) > 0 then
 else
 EventID = session("EventID")
end if
if len(EventID) > 0  and not (Current = "DeleteEvents")  then
sql = "select EventTypeID, EventName, PeopleID from event where EventID =  " & EventID & " Order by EventID Desc"

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventName = rs("EventName")
	PeopleID = rs("PeopleID")
	EventTypeID = rs("EventTypeID")
end if
rs.close

sql3 = "select * from EventPageLayout where  PageAvailable = True and ShowPage = True and EventID = " & EventID
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof  

if rs3("PageName") = "Halter Show" then
  ShowHalterShow = True 
End If
 
 if rs3("PageName") = "Fleece Show" then
   ShowFleeceShow = True 
 End If
 

if rs3("PageName") = "Spin-Off" then
    ShowSpinOff = True
End If
 
if rs3("PageName") = "Advertising" then
    ShowAdvertising = True 
End If

if rs3("PageName") = "Vendors" then
    ShowVendors = True 
End If

if rs3("PageName") = "Sponsors" then
    ShowSponsors = True
End If

if trim(rs3("PageName")) = "Classes" then
    ShowClasses = True 
End If

if rs3("PageName") = "Dinner" then
    ShowDinner = True 
End If

if rs3("PageName") = "Silent Auction" then
    ShowSilentAuction = True
End If

if rs3("PageName") = "Stud Auction" then
    ShowStudAuction = True
End If
    
    
if rs3("PageName") = "Forms" then
    Form = True
End If    
rs3.movenext
wend

end if

%>
<table cellpadding = "0" cellspacing = "0" border = "0" width = "<%=screenwidth - 10%>" height = "28">
<tr><td>
<%  if Current = "EventsList" then %>
    <td class = "tabtopon"  width = "120" height = "30" align = "center" ><b><a href = "Default.asp?PeopleID=<%=PeopleID%>" class = "menu2"><center>List of Events</center></a></b></td>
   <% else %>
      <td class = "tabtopoff" width = "120" height = "30" align = "center" ><b><a href = "Default.asp?PeopleID=<%=PeopleID%>" class = "menu"><center>List of Events</center></a></b></td>
    <% end if %>

    <%  if Current = "Createevent" then %>
    <td class = "tabtopon"  width = "120" height = "30" align = "center" ><b><a href = "RegCreateType.asp" class = "menu2"><center>Add New Event</center></a></b></td>
   <% else %>
      <td class = "tabtopoff" width = "120" height = "30" align = "center" ><b><a href = "RegCreateType.asp" class = "menu"><center>Add New Event</center></a></b></td>
    <% end if %>

<% if len(EventID) > 0  and not (Current = "DeleteEvents")  then %>
     
<%  if Current = "Dashboard" then %>
    <td class = "tabtopon"  width = "120" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "RegmanageHome.asp?EventID=<%=eventID%>" class = "menu2"><center> Event Dashboard Home</center></a></b></td>
   <% else %>
 <td class = "tabtopoff" width = "120" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "RegmanageHome.asp?EventID=<%=eventID%>" class = "menu"><center>Event Dashboard Home</center></a></b></td>
    <% end if %>

  <% 
   if Current = "Event Home" then %>
 <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "EditEventHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Page Setup</center></a></b></td>
   <% else %>
      <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "EditEventHome.asp?EventID=<%=eventID%>" class = "menu"><center>Page Setup</center></a></b></td>
    <% end if %>
   
   

   <%
   ShowReports = True
   if ShowReports = True then
    if Current = "Reports" then %>
   <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "ReportsHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Reports</center></a></b></td>
   <% else %>
   <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "Reportshome.asp?EventID=<%=eventID%>" class = "menu"><center>Reports</center></a></b></td>
   <% end if %>
  <% end if %> 
   
   <% if Current = "Registrations" then %>
   <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "ReportRegistrationsList.asp?EventID=<%=eventID%>" class = "menu2"><center>Registrations</center></a></b></td>
   <% else %>
   <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "ReportRegistrationsList.asp?EventID=<%=eventID%>" class = "menu"><center>Registrations</center></a></b></td>
   <% end if %>
   
   <% 
   If not EventTypeID = 5 then
   
   if Current = "AddRegistration" then %>
   <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "AddRegistration.asp?EventID=<%=eventID%>" class = "menu2"><center>Add Registration</center></a></b></td>
   <% else %>
   <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "AddRegistration.asp?EventID=<%=eventID%>" class = "menu"><center>Add Registration</center></a></b></td>
   <% end if %>
      <% end if %>

  <%
   If not EventTypeID = 5 then
  
   if Current = "Forms" then %>
   <td class = "tabtopon"width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "FormsAdmin.asp?EventID=<%=eventID%>" class = "menu2"><center>Forms</center></a></b></td>
   <% else %>
   <td class = "tabtopoff"  width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "FormsAdmin.asp?EventID=<%=eventID%>" class = "menu"><center>Forms</center></a></b></td>
   <% end if %>
     <% end if %>
   
   
<% if ShowHalterShow = True or ShowFleeceShow = True or ShowSpinOff = True then %>
  <% if Current = "Judges" then %>

   <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "JudgesHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Judges</center></a></b></td>
      
     <% else %> 
            <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "JudgesHome.asp?EventID=<%=eventID%>" class = "menu"><center>Judges</center></a></b></td>
	<% end if %>

  
<% end if %>


<%    If not EventTypeID = 5 then %>
<% if Current = "Extra Options" then %>

   <td class = "tabtopon"width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "ExtraOptionsHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Extra<br>Options</center></a></b></td>
      
     <% else %> 
            <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "ExtraOptionsHome.asp?EventID=<%=eventID%>" class = "menu"><center>Extra<br>Options</center></a></b></td>
	<% end if %>

		<% end if %>
	
	<%   If not EventTypeID = 5 then %>
 <% if Current = "Other" then %>
   <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "OtherHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Other Pages</center></a></b></td>
   <% else %>
   <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "OtherHome.asp?EventID=<%=eventID%>" class = "menu"><center>Other Pages</a></b></td>
   <% end if %>
  <% end if %>

 <%
 ShowFormatting = True
 if  ShowFormatting = True then
 
  if Current = "Formatting" then %>
   <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "FormattingHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Formatting</center></a></b></td>
   <% else %>
   <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "FormattingHome.asp?EventID=<%=eventID%>" class = "menu"><center>Formatting</center></a></b></td>
   <% end if
 end if  
   
    %>
   <% showusersadmin = True
   if showusersadmin = True then
    %>
   <% if not EventTypeID = 5 then %>
 <% if Current = "Contacts" then %>
   <td class = "tabtopon" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "Contacts.asp?EventID=<%=eventID%>" class = "menu2"><center>Contacts</center></a></b></td>
   <% else %>
   <td class = "tabtopoff" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "Contacts.asp?EventID=<%=eventID%>" class = "menu"><center>Contacts</center></a></b></td>
   <% end if %>
   <% end if %>
     <% end if %>
   <% end if %>
   <td background = "images/TopTabBlank.jpg">&nbsp;</td>
</tr>
</table>
