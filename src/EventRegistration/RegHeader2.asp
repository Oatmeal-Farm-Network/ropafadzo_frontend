<% PeopleID = request.querystring("PeopleID")
if len(PeopleID) > 0 then
  session("PeopleID") = PeopleID

 else
 PeopleID = session("PeopleID")
end if

%>


<table  width = "100%" height = "24">
   <tr>
	 <td align = "right" valign = "bottom">
	 <a href = "RegHome.asp" class = "menu2"><b>Your Events</b></a> |
	  <a href = "regcreate.asp?PeopleID=<%=PeopleID%>" class = "menu2"><b>List an Event</b></a> |
	  <a href = "regAccountInfo.asp" class = "menu2"><b>Your Information</b></a> |
	 </td>
	</tr>
	   <tr>
	 <td align = "right" valign = "bottom" height = "6"><img src = "images/px.gif" height = "0" width = "0"></td>
	</tr>
</table>
