
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


sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and EventID = " & EventID
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof  


 if rs3("ServiceType") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs3("ServiceType") = "Fleece Show" then
       ShowFleeceShow = True 
     End If

     if rs3("ServiceType") = "Vendors" then
       ShowVendors = True 
     End If

     if rs3("ServiceType") = "Sponsor" then
       ShowSponsors = True
     End If

     if trim(rs3("ServiceType")) = "Classes / Workshops" then
       ShowClasses = True 
     End If

     if rs3("ServiceType") = "Dinner" then
       ShowDinner = True 
     End If

     if rs3("ServiceType") = "Silent Auction" then
       ShowSilentAuction = True
     End If


rs3.movenext
wend
%>
<h1><%=EventName%></h1>
<table cellpadding = "0" cellspacing = "0" border = "0" width = "1000" height = "28">
   <tr>
   <td class = "body2" width = "90" align = "center"><b><a href = "RegmanageHome.asp?EventID=<%=eventID%>" class = "menu2">Overview</a></b></td>
   <% if ShowVendors = True then %>
   <td class = "body2"  width = "90" align = "center"><b><a href = "VendorsHome.asp?EventID=<%=eventID%>" class = "menu2">Vendors</a></b></td>
   <% end if %>
     <% if ShowSponsors = True then %>
   <td class = "body2" width = "90"  align = "center"><b><a href = "SponsorsHome.asp?EventID=<%=eventID%>" class = "menu2">Sponsors</a></b></td>
   <% end if %>
     <% if ShowClasses = True then %>
   <td class = "body2" width = "90" background = "images/SelectedHeader.jpg" align = "center"><b><a href = "ClassesHome.asp?EventID=<%=eventID%>" class = "menu2">Classes / Workshops</a></b></td>
   <% end if %>
     <% if  ShowSilentAuction = True then %>
    <td class = "body2" width = "90" align = "center"><b><a href = "SilentAuctionHome.asp?EventID=<%=eventID%>" class = "menu2">Silent Auction</a></b></td>
    <% end if %>
    <td>&nbsp;</td>
   </tr>
   </table>
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "1000" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
   <td ><img src = "images/px.gif" width = "20" height = "1" >
    	<a href = "ClassesHome.asp?EventID=<%=eventID%>" class = "menu2">Classes Setup</a> |
 	 <a href = "ClassesAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Classes</a> |&nbsp; 

    	 	<%
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from ClassInfo  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>
	<a href = "ClassesAdd.asp?EventID=<%=EventID%>#Edit" class = "menu2">Edit Classes</a> |&nbsp; 
	 <% end if %>  	
    	
 
	 
 
     <a href = "StudentsAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Students</a> | 
         	 	<%
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from ClassReg  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then %>
	 <a href = "StudentsEdit.asp?EventID=<%=EventID%>" class = "menu2">Edit Students</a> | 
	 <% end if %>  
	 
 
	 </td>
	</tr>
	<tr>
	 <td align = "right" valign = "bottom" height = "6" colspan = "3"><img src = "images/px.gif" height = "0" width = "0"></td>
	</tr>
</table>







	 
