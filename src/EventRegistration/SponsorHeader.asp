   <% Current = "Sponsors" %>
   <!--#Include File ="HeaderTabsInclude.asp"--> 
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "34" >
   <tr>
    <td bgcolor="darkgreen" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
   <td bgcolor="darkgreen"><img src = "images/px.gif" width = "20" height = "1" >
    	<a href = "SponsorsHome.asp?EventID=<%=eventID%>" class = "menu2">Sponsorship Overview</a> |
    	<a href = "SponsorshipAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Sponsorship Options</a> |  
 		<a href = "SponsorEditDetails.asp?EventID=<%=EventID%>#Edit" class = "menu2">Edit Sponsorship Options</a> <% showaddsponsors = false
 if showaddsponsors = true then		 %>| 
     	<a href = "SponsorAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Sponsors</a> | 
	 <a href = "SponsorEdit.asp?EventID=<%=EventID%>" class = "menu2">Edit Sponsors</a> 
<% end if %> 
	  </td>
	 <td align = "right" bgcolor="darkgreen">
	 	   <!--#Include File ="RightmenuInclude.asp"--> 
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include File ="HeaderTabsIncludeBottom.asp"--> 



