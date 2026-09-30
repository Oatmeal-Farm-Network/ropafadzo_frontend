   <% Current = "Event Home" %>
   <!--#Include virtual="HeaderTabsInclude.asp"--> 
   
   
   
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "<%=screenwidth -10%>" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
      <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
   <td ><img src = "images/px.gif" width = "20" height = "1" >

	 </td>
	 <td align = "right">
	 	<a href = "RegHome.asp?PeopleID=<%=PeopleID%>" class = "menu2">List of Your Events</a> |
 		<a href = "EditEvent.asp?EventID=<%=EventID%>" class = "menu2">Your Information</a> |
	 	<a href = "PhotoContestHome.asp?EventID=<%=PeopleID%>" class = "menu2">Photo Contest</a>&nbsp;
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include virtual="HeaderTabsIncludeBottom.asp"--> 
