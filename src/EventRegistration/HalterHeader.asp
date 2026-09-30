   <% Current = "Halter" %>
   <!--#Include File ="HeaderTabsInclude.asp"--> 
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
   <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
   <td align = "left"><img src = "images/px.gif" width = "20" height = "1" >
	 <a href = "HalterHome.asp?EventID=<%=EventID%>" class = "menu2">Halter Overview</a> | 
	  <a href = "PageData2.asp?pagename=Vet Check&EventID=<%=EventID%>&Header=Halter" class = "menu2">Vet Check</a>
	
	 <% Show=false
	 if Show = true then %>
	 
	 <a href = "HalterAddAnimal.asp&EventID=<%=EventID%>" class = "menu2">Add Animals</a> | 
    <a href = "HalterClasslist.asp?EventID=<%=eventID%>" class = "menu2">Halter Class List</a> 
    <% end if %>
  
	  </td>
	 <td align = "right">
	 	   <!--#Include File ="RightmenuInclude.asp"--> 
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include File ="HeaderTabsIncludeBottom.asp"--> 
