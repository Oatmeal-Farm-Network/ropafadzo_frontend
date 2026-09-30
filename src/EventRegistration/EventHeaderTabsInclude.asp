<% EventID = request.querystring("EventID")


if len(EventID) > 0 then
 else
 EventID = session("EventID")
end if

sql = "select EventName, PeopleID from event where EventID =  " & EventID & " Order by EventID Desc"
		' response.write(sql)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql, conn, 3, 3   
		If Not rs.eof Then
  			EventName = rs("EventName")
  			PeopleID = rs("PeopleID")
		end if
		rs.close


sql3 = "select * from EventPageLayout where  PageAvailable = True and ShowPage = True and EventID = " & EventID
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof  


 if rs3("PageName") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs3("PageName") = "Fleece Show" then
       ShowFleeceShow = True 
     End If
     
         if rs3("PageName") = "SpinOff" then
       ShowSpinOff = True
     End If
 
     
     
     if rs3("PageName") = "Advertising" then
       ShowAdvertising = True 
     End If


     if rs3("PageName") = "Vendors" then
       ShowVendors = True 
     End If

     if rs3("PageName") = "Sponsor" then
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
     
  

rs3.movenext
wend
%>
<% 
headingfound = False

If Len(Header) > 1 Then 
	headingfound = True %>
		<center><img src = "<%=Header %>" width = "<%=Pagewidth%>"></center>
<% End If 


if len(Logo) > 1 and headingfound = False then 
	headingfound = True
%>
	<center><img src = "<%=Logo %>" height = "100" align = "center" border = "0"><br></center>
<% end if %>

<% if headingfound = False then %>
<h1><%=EventName%></h1>
<% end if %>

<table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "28">
   <tr>
     <td align = "left">
     
  <% 
  ' response.write("Current=" & Current) 
  
  if Current = "Overview" then %>
  
   <td class = "body2" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "EventHome.asp?EventID=<%=eventID%>" class = "menu2">Event Home</a></b></td>
   <% else %>
      <td class = "body2" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "EventHome.asp.asp?EventID=<%=eventID%>" class = "menu2">Event Home</a></b></td>
    <% end if %>
   
 

  <% if Current = "Forms" then %>
   <td class = "body2" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "FormsAdmin.asp?EventID=<%=eventID%>" class = "menu2">Forms</a></b></td>
   <% else %>
   <td class = "body2" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "FormsAdmin.asp?EventID=<%=eventID%>" class = "menu2">Forms</a></b></td>
   <% end if %>


 
   
   
   
<% if ShowHalterShow = True or ShowFleeceShow = True or ShowSpinOff = True then %>
  <% if Current = "Judges" then %>

   <td class = "body2" width = "90" height = "30" align = "center" background = "images/TabOn.jpg"><b><a href = "EventJudges.asp?EventID=<%=eventID%>" class = "menu2">Judges</a></b></td>
      
     <% else %> 
            <td class = "body2" width = "90" height = "30" align = "center" background = "images/TabOff.jpg"><b><a href = "EventJudges.asp?EventID=<%=eventID%>" class = "menu2">Judges</a></b></td>
	<% end if %>

  
<% end if %>

   <td background = "images/TopTabBlank.jpg">&nbsp;</td>
</tr>
</table>




   

