   <% Current = "Other" %>
   <!--#Include File ="HeaderTabsInclude.asp"--> 
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
   	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>

   <td ><img src = "images/px.gif" width = "20" height = "1" >
    <a href = "OtherHome.asp?EventID=<%=eventID%>" class = "menu2">Other Pages Overview</a> |
   <% Addlater = True
  if  Addlater =  False then %>
    <a href = "Testimonialsadmin.asp&EventID=<%=EventID%>" class = "menu2">Testimonials</a> |
    <a href = "EditGalleryImages.asp&EventID=<%=EventID%>" class = "menu2">Photo Gallery</a> |
  <% end if %>
     <a href = "PageData2.asp?Header=Other&pagename=Fiber Arts Show&EventID=<%=eventID%>" class = "menu2">Fiber Arts</a> |
    <a href = "PageData2.asp?Header=Other&pagename=Photo Contest&EventID=<%=eventID%>" class = "menu2">Photo Contest</a> |
   <a href = "PageData2.asp?Header=Other&pagename=Accomodations&EventID=<%=eventID%>" class = "menu2">Accomodations</a> |
    <a href = "PageData2.asp?Header=Other&pagename=Driving Directions&EventID=<%=eventID%>" class = "menu2">Driving Directions</a>

	  </td>
	 <td align = "right">
	 	   <!--#Include File ="RightmenuInclude.asp"--> 
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include File ="HeaderTabsIncludeBottom.asp"--> 
