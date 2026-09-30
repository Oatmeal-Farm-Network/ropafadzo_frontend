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
<small><br></small>


<% 
response.write("LayoutStyle=" & LayoutStyle )
pagewidth = "459"
layoutstylefound = False

if LayoutStyle = "Portrait1" then %>

<table  width="<%=pagewidth%>" border="<%=PageBorder%>" cellpadding=0 cellspacing=0  bgcolor = "<%=MenuBackgroundColor%>" background = "<%=MenuBackgroundImage %>" align="center">
	<tr>
		<td align="center" valign="top">
		<table width="<%=pagewidth%>" border="0" cellpadding=0 cellspacing=0>
			<tr><td colspan = "2"><% if len(Header) > 1 then%><img src = "<%=Header%>"width="<%=PageWidth%>" ><% end if %></td><tr>
			<tr>
		  	<td width = "200" valign = "top">
		  	
			<% x=1
			while x < totalpages + 1 %><br>
				<a href = '<%=FileNameArray(x)%>' class= "menu" >&nbsp;<%=PageNameArray(x)%></a><br>
			<% x = x + 1
			 wend
			%>

			</td>
			<td class = "body" valign = "top"> 
  
			<table  width="<%=pagewidth - 200%>" height = "400" border="0" cellpadding=0 cellspacing=0 valign = "top" bgcolor = "<%=PageBackgroundColor%>" background = "<%=PageBackgroundImage%>" align="center">
			<tr><td valign = "top">



<% layoutstylefound = True 
end if %>


<% if LayoutStyle = "Portrait2" then %>

<table  width="400" border="<%=PageBorder%>"  cellpadding=0 cellspacing=0 valign = "top" bgcolor = "<%=MenuBackgroundColor%>" align="center">
	<tr>
		<td align="center" valign="top" width = "100">
		<table width="100" border="0" cellpadding=0 cellspacing=0 background = "<%=MenuBackgroundImage %>">
			<tr>
		  	<td width = "100" valign = "top">
		  	
	
<br><br>
			</td>
		</tr>
		</table>
		</td>
			<td class = "body" valign = "top" width = "300"> 
  
			<table  width="300" height = "400" border="0" cellpadding=0 cellspacing=0 valign = "top" bgcolor = "<%=PageBackgroundColor%>" align="center">
			<tr><td colspan = "2"><% if len(Header) > 1 then%><a href = "defualt.asp"><img src = "<%=Header%>"width="300" border = "0"></a><% end if %></td><tr>
			<tr>
			<tr><td valign = "top" background = "<%=PageBackgroundImage%>"> 

<% layoutstylefound = True 
end if %>



<% if LayoutStyle = "Landscape" and layoutstylefound = False then %>
<table  width="<%=pagewidth%>" border="<%=PageBorder%>"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   bgcolor = "<%=MenuBackgroundColor%>"  align="center"><tr><td align="center" valign="top"><table width="<%=pagewidth%>" border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   ><tr><td><% if len(Header) > 1 then%><img src = "<%=Header%>" width="<%=PageWidth%>" ><% end if %></td></tr>
<tr ><td height = "15" background = "<%=MenuBackgroundImage %>"><img src = "images/px.gif" width="1" height = "1"></td></tr></table>
</td></tr><tr><td>
<table  width="<%=pagewidth%>" border="0" cellpadding=0 cellspacing=0 valign = "top" bgcolor = "<%=PageBackgroundColor%>" align="center" background = "<%=PageBackgroundImage%>">
<tr><td>


<% end if %>
