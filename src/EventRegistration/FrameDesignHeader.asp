<SCRIPT LANGUAGE="JavaScript" type="text/javascript">
<!-- Begin
function NewWindow(mypage, myname, w, h, scroll) {
var winl = (screen.width - w) / 2;
var wint = (screen.height - h) / 2;
winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable'
win = window.open(mypage, myname, winprops)
if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}
//  End -->
</script>

<script type="text/javascript"><!--//--><![CDATA[//><!--

sfHover = function() {
	var sfEls = document.getElementById("nav").getElementsByTagName("LI");
	for (var i=0; i<sfEls.length; i++) {
		sfEls[i].onmouseover=function() {
			this.className+=" sfhover";
		}
		sfEls[i].onmouseout=function() {
			this.className=this.className.replace(new RegExp(" sfhover\\b"), "");
		}
	}
}
if (window.attachEvent) window.attachEvent("onload", sfHover);

//--><!]]></script>



<% 
'response.write("LayoutStyle=" & LayoutStyle )
pagewidth = "459"
layoutstylefound = False

if LayoutStyle = "Portrait1" or LayoutStyle = "Portrait" then %>

<table  width="400" border="1" bordercolor="black" cellpadding=0 cellspacing=0  align = "<%=PageAlign%>"  align="center">
	<tr>
		<td align="center" valign="top" width = "400"  background = "<%=PageBackgroundImage%>">
<table width="400" border="0" cellpadding=0 cellspacing=0>
<tr><td colspan = "2"><% if len(Header) > 1 then%><img src = "<%=Header%>"width="400" ><% else %>
<% if len(Logo) > 1 then %><center><img src = "<%=Logo%>" width="100" border = "0" align= "center"></center>
<% else %><center><font size = "6"><%=custCompany %></font></center><% end if %>
<% end if %></td><tr>
			<tr>
		  	<td width = "200" valign = "top" bgcolor = "<%=MenuBackgroundColor%>"  background = "<%=MenuBackgroundImage%>">
		  	
			

			</td>
			<td class = "body" valign = "top" bgcolor = "<%=PageBackgroundColor%>" background = "<%=PageBackgroundImage%>"> 
   			<img src = "images/px.gif" width = "300" height = "200" BORDER = "0">

	



<% layoutstylefound = True 
end if %>


<% if LayoutStyle = "Portrait2" then %>
<table  width="400" border="<%=PageBorder%>" bordercolor="<%=PageBordercolor%>" cellpadding=0 cellspacing=0  align = "<%=PageAlign%>" bgcolor = "<%=MenuBackgroundColor%>" align="center">
	<tr>
		<td align="center" valign="top" width = "400">

<table  width="400"  cellpadding=0 cellspacing=0  bgcolor = "<%=MenuBackgroundColor%>" align="center"  background = "<%=MenuBackgroundImage%>">
<tr>
<td align="center" valign="top" width = "100" >
	<% if len(Logo) > 4 then %><img src = "<%=Logo%>" width="100" border = "0">
	<% else %>
	<img src = "images/YourLogo.gif" width="100" border = "0">
	<% end if %>
	<br><br>
</td>
<td class = "body" valign = "top" width = "300" bgcolor = "<%=PageBackgroundColor%>" background = "<%=PageBackgroundImage%>"> 
 <% if len(Header) > 1 then%><img src = "<%=Header%>" width="300" border = "0" ><br><% end if %>
 <img src = "images/px.gif" width = "300" height = "200" BORDER = "0">
<% layoutstylefound = True 
end if %>



<% if LayoutStyle = "Landscape" and layoutstylefound = False then %>
<table  width="400" border="<%=PageBorder%>" bordercolor="<%=PageBordercolor%>" cellpadding=0 cellspacing=0  align = "<%=PageAlign%>" bgcolor = "<%=MenuBackgroundColor%>" align="center"><tr>
		<td align="center" valign="top" width = "400">
		<table width="400" border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
		  <tr>
		    <td colspan = "2" align = "center"><% if len(Header) > 1 then%><img src = "<%=Header%>" width="400" ><% else if len(Logo) > 1 then %><center><img src = "<%=Logo%>" width="100" border = "0" align= "center"></center><% else %><center><font size = "6"><%=custCompany %></font></center><% end if %><% end if %></td>
		  </tr>
		   <tr >
		      <td colspan = "2" height = "15" background = "<%=MenuBackgroundImage %>"><img src = "images/px.gif" width="1" height = "1">
		 </td></tr>
		 <tr><td colspan = "2" bgcolor = "<%=PageBackgroundColor%>"  background = "<%=PageBackgroundImage%>">
			 <img src = "images/px.gif" width = "300" height = "200" BORDER = "0">
<% end if %>
